import { exec } from 'child_process'
import spawn from 'cross-spawn'
import { glob } from 'majo'
import { tmpdir } from 'os'
import path from 'path'
import { SetRequired } from 'type-fest'
import { promisify } from 'util'
import { GritError } from '@/error'
import { colors, logger } from '@/logger'
import { spinner } from '@/spinner'
import { store } from '@/store'
import {
	getNpmClient,
	InstallOptions,
	installPackages,
	NPM_CLIENT,
} from '@/utils/cmd'
import { pathExists, readFile } from '@/utils/files'
import { getGitUser, GitUser } from '@/utils/git-user'
import { GeneratorConfig } from './generatorConfig'
import { Prompt, Prompts } from './prompts'
import { Action, Actions } from './actions'
import { Data } from './data'
import { Completed } from './completed'
import { Prepare } from './prepare'
import { Plugins } from './plugins'
import { addPluginData } from './plugins/pluginDataProvider'
import { Answers } from './prompts/prompt'
import {
	NpmGenerator,
	ParsedGenerator,
	parseGenerator,
	RepoGenerator,
} from '@/utils/parseGenerator'
import pkg from '@/../package.json'

export interface GritOptions<T = Record<string, any>> {
	/**
	 * Name of directory to output to or relative path to it
	 * Will be created if it does not alreadt exist.
	 * Defaults to the current working directory.
	 */
	outDir?: string
	/**
	 *  Controls the level of logging that is shown in the console.
	 *	1: Errors and success messages only
	 *	2: Errors and warnings
	 *	3: Errors, warnings and info
	 *	4: Errors, warnings, info and debug
	 */
	logLevel?: 1 | 2 | 3 | 4
	/**
	 * Sets logLevel to 4
	 * prevents dependency installation prevents
	 * prevents git init
	 */
	debug?: boolean
	/** Least amount of logging to the console */
	silent?: boolean
	/** generator string */
	config: GeneratorConfig
	/** generator information */
	generator: ParsedGenerator | string
	/** Update cached generator before running */
	update?: boolean
	/** Use `git clone` to download repo */
	clone?: boolean
	/** Use a custom npm registry */
	registry?: string
	/**
	 * Mock git info, prompts etc
	 * Additionally, Set ENV variable NODE_ENV to test to enable this
	 */
	mock?: boolean
	/**
	 * User-supplied answers to prompts
	 */
	answers?: Answers | string
	/** Extra data payload to provide the generator at runtime */
	extras?: T
}

const IDLE = 'idle'
const PREPARE = 'prepare'
const POST_PREPARE = 'post-prepare'
const PROMPT = 'prompt'
const POST_PROMPT = 'post-prompt'
const DATA = 'data'
const POST_DATA = 'post-data'
const ACTIONS = 'action'
const POST_ACTIONS = 'post-actions'
const COMPLETE = 'complete'
const FINISHED = 'completed'

type GenState =
	| typeof IDLE
	| typeof PREPARE
	| typeof POST_PREPARE
	| typeof PROMPT
	| typeof POST_PROMPT
	| typeof DATA
	| typeof POST_DATA
	| typeof ACTIONS
	| typeof POST_ACTIONS
	| typeof COMPLETE
	| typeof FINISHED

type StatefulMethod = (context: Grit) => Promise<void> | void

type StatefulMethods = Record<GenState, StatefulMethod[]>

export class Grit {
	opts: SetRequired<GritOptions, 'outDir' | 'logLevel' | 'mock' | 'debug'>
	/** Use a console spinner to make asyncronous calls more user friendly */
	spinner = spinner
	/** Colorize your console output */
	colors = colors
	/** Log to the console with Grit */
	logger = logger
	/** Access Grit local storage */
	store = store
	/** information about the current generator */
	generator: ParsedGenerator

	// generator runtime environment instances
	/** Runs operations inside the prepare section of a generator */
	private prepare: Prepare
	/** Runs operations inside the prompts section of a generator */
	private _prompts: Prompts
	/** Runs operations inside the data section of a generator */
	private _data: Data
	/** Runs operations inside the actions section of a generator */
	private _actions: Actions
	/** Runs operations inside the data section of a generator */
	private completed: Completed

	private plugins?: Plugins
	private _state: GenState = IDLE
	private statefulMethods: StatefulMethods = {
		[IDLE]: [],
		[PREPARE]: [],
		[POST_PREPARE]: [],
		[PROMPT]: [],
		[POST_PROMPT]: [],
		[DATA]: [],
		[POST_DATA]: [],
		[ACTIONS]: [],
		[POST_ACTIONS]: [],
		[COMPLETE]: [],
		[FINISHED]: [],
	}

	constructor(opts: GritOptions) {
		this.opts = {
			...opts,
			outDir: path.resolve(opts.outDir || '.'),
			logLevel: opts.logLevel || 3,
			mock: typeof opts.mock === 'boolean' ? opts.mock : false,
			debug: typeof opts.debug === 'boolean' ? opts.debug : false,
		}

		if (typeof this.opts.answers === 'string') {
			this.opts.answers = JSON.parse(this.opts.answers)
		}

		// Set log level from run mode
		if (opts.debug) {
			this.opts.logLevel = 4
		} else if (opts.silent) {
			this.opts.logLevel = 1
		}

		// configure logger
		logger.setOptions({
			logLevel: this.opts.logLevel,
			mock: this.opts.mock,
		})

		// redirect outDir to temp dir when mock mode is enabled
		if (this.opts.mock) {
			this.opts.debug = true
			this.opts.outDir = path.join(tmpdir(), `grit-out/${Date.now()}/out`)
		}

		// use directly passed parsed generator or parse generator string
		if (typeof opts.generator === 'string') {
			this.generator = parseGenerator(this.opts.generator as string)
		} else {
			this.generator = this.opts.generator as NpmGenerator | RepoGenerator
		}

		// Instantiate generator runtime environments
		this.prepare = new Prepare(this)
		this._prompts = new Prompts(this)
		this._data = new Data(this)
		this._actions = new Actions(this)
		this.completed = new Completed(this)
	}

	/** Generator execution methods */

	/**
	 * Run the generator with the configured options
	 * Execures the prepare, prompt, data, actions, and completed sections of a generator config file
	 */
	async runGenerator(
		config: GeneratorConfig = this.opts.config
	): Promise<void> {
		if (config.description) {
			logger.status('green', 'Generator', config.description)
		}

		// Run generator prepare
		if (config.prepare) {
			this.state = PREPARE
			await this.prepare.run()
			this.state = POST_PREPARE
		}

		// Run generator prompt section
		if (config.prompts) {
			this.state = PROMPT
			await this._prompts.run()
			this.state = POST_PROMPT
		}

		// Register the plugin data provider
		this._data.registerDataProvider(
			await addPluginData(this._prompts.prompts, this.answers)
		)

		// Run generator data section
		this.state = DATA
		await this._data.run()
		this.state = POST_DATA

		// Load plugin data then register actions provider
		if (this.data.selectedPlugins && this.data.selectedPlugins.length > 0) {
			this.plugins = new Plugins({
				config: config.plugins,
				selectedPlugins: this.data.selectedPlugins,
				generatorPath: this.generator.path,
			})
			await this.plugins.loadPlugins()
			this._actions.registerActionProvider(
				await this.plugins.addPluginActions()
			)
		}

		// Run generator actions section
		if (config.actions) {
			this.state = ACTIONS
			await this._actions.run()
			this.state = POST_ACTIONS
		}

		// Run generator completed section
		if (!this.opts.mock && config.completed) {
			this.state = COMPLETE
			await this.completed.run()
			this.state = FINISHED
		}
	}

	/**
	 * Method to run when instantiated with a generator
	 */
	async run(): Promise<this> {
		await this.runGenerator()
		return this
	}

	/**
	 * Block execution for inside generator runtimes for particular states
	 * Will throw an error if access is blocked
	 *
	 * @param accessItem name of the item attempting to be accessed
	 * @param denyStates states in which access is denied
	 * @param allowStates states in which access is exclusivly allowed
	 */
	private setPermissions(
		accessItem: string,
		denyStates?: string[],
		allowStates?: string[]
	): void {
		// Check if the current state is one of the denied states
		if (denyStates && denyStates.includes(this.state)) {
			throw new Error(
				`You cannot access ${accessItem} in the ${this.state} section`
			)
		}

		// Check if the current state is one of the allowed states
		if (allowStates && !allowStates.includes(this.state)) {
			throw new Error(
				`You cannot access ${accessItem} in the ${this.state} section`
			)
		}

		return
	}

	/** Generator Instance Properties */

	/**
	 * Retrive the answers
	 *
	 * You can't access this in `prompts` function
	 */
	get answers(): Answers {
		this.setPermissions('answers', [PROMPT])
		return this._prompts.answers
	}

	set answers(value: Answers) {
		this._prompts.answers = value
	}

	/**
	 * The combination of answers and data from the data generator methods
	 *
	 * Used to give generator functions more custom data to work with
	 */
	get data(): Answers {
		this.setPermissions('data', [PREPARE, PROMPT])
		return {
			...this.answers,
			...this._data.data,
		}
	}

	set data(value: Answers) {
		this._data.data = value
	}

	get prompts(): Prompt[] {
		return this._prompts.prompts
	}

	get actions(): Action[] {
		return this._actions.actions
	}

	get state(): GenState {
		return this._state
	}

	set state(newState: GenState) {
		this._state = newState

		// execute all of the functions in statefulMethods for the new state
		this.statefulMethods[newState].forEach((method) => method(this))
	}

	/**
	 * Read package.json from output directory
	 *
	 * Returns an empty object when it doesn't exist
	 */
	get pkg(): Record<string, any> {
		try {
			return require(path.join(this.outDir, 'package.json'))
		} catch (err) {
			return {}
		}
	}

	get generatorPkg(): Record<string, any> {
		try {
			return require(path.join(this.generator.path, 'package.json'))
		} catch (err) {
			return {}
		}
	}

	get gritPkg(): Record<string, any> {
		return pkg
	}

	/**
	 *  Get the information of system git user
	 */
	get gitUser(): GitUser {
		return getGitUser(this.opts.mock)
	}

	/**
	 *  The basename of output directory
	 */
	get projectName(): string {
		return path.basename(this.opts.outDir)
	}

	/**
	 * The absolute path to output directory
	 */
	get outDir(): string {
		return path.resolve(this.opts.outDir)
	}

	/** The npm client */
	get npmClient(): NPM_CLIENT {
		return getNpmClient()
	}

	/** Generator Instance Methods */

	/** Add a method that will run when the generator reached the specified state */
	setStatefulMethod(state: GenState, method: StatefulMethod): void {
		this.statefulMethods[state].push(method)
	}

	/**
	 * 	Run `git init` in output directly
	 */
	gitInit(): void {
		this.setPermissions('gitInit', [], [COMPLETE])
		if (this.opts.mock || this.opts.debug) {
			logger.debug('Skipping git init')
			return
		}

		const ps = spawn.sync('git', ['init'], {
			stdio: 'ignore',
			cwd: this.outDir,
		})
		if (ps.status === 0) {
			logger.success('Initialized empty Git repository')
		} else {
			logger.debug(`git init failed in ${this.outDir}`)
		}
	}

	/**
	 * Run a git commit with a custom commit message in output directory
	 */
	async gitCommit(commitMessage?: string): Promise<void> {
		this.setPermissions('gitInit', [], [COMPLETE])
		if (this.opts.mock || this.opts.debug) {
			logger.debug('Skipping git commit')
			return
		}

		const outDir = this.outDir

		try {
			// add
			await promisify(exec)(
				`git --git-dir="${outDir}"/.git/ --work-tree="${outDir}"/ add -A`
			)
			// commit
			await promisify(exec)(
				`git --git-dir="${outDir}"/.git/ --work-tree="${outDir}"/ commit -m "${
					commitMessage || 'Commit'
				}"`
			)
			logger.success('created a git commit.')
		} catch (err) {
			logger.debug('An error occured while creating git commit', err)
		}
	}

	/** Run `npm install` in output directory */
	async npmInstall(
		opts?: Omit<InstallOptions, 'cwd' | 'registry'>
	): Promise<{ code: number }> {
		this.setPermissions('gitInit', [], [COMPLETE])
		if (this.opts.mock || this.opts.debug) {
			logger.debug('npm install skipped')
			return { code: 0 }
		}

		return installPackages(
			Object.assign(
				{
					registry: this.opts.registry,
					cwd: this.outDir,
				},
				opts
			)
		)
	}

	/** Display a success message */
	showProjectTips(): void {
		this.setPermissions('gitInit', [], [COMPLETE])
		spinner.stop() // Stop when necessary
		logger.success(`Generated into ${colors.underline(this.outDir)}`)
	}

	/**
	 * Create an Grit Error so we can pretty print the error message instead of showing full error stack
	 */
	createError(message: string): GritError {
		return new GritError(message)
	}

	/** Testing Helpers */

	/**
	 * Get file list of output directory
	 */
	async getOutputFiles(): Promise<string[]> {
		const files = await glob(['**/*', '!**/node_modules/**', '!**/.git/**'], {
			cwd: this.opts.outDir,
			dot: true,
			onlyFiles: true,
		})
		return files.sort()
	}

	/**
	 * Check if a file exists in output directory
	 */
	async hasOutputFile(file: string): Promise<boolean> {
		return await pathExists(path.join(this.opts.outDir, file))
	}

	/**
	 *  Read a file in output directory
	 */
	async readOutputFile(file: string): Promise<string> {
		const contents = await readFile(path.join(this.opts.outDir, file), 'utf8')
		if (file.endsWith('.json')) {
			return JSON.parse(contents)
		}
		return contents
	}
}
