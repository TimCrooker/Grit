import { exec } from 'child_process'
import spawn from 'cross-spawn'
import { Answers } from 'inquirer'
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
import { ensureGeneratorExists } from './ensureGenerator'
import { GeneratorConfig, loadConfig } from './generatorConfig'
import { defautGeneratorFile } from './generatorConfig/default-generator'
import {
	ParsedGenerator,
	parseGenerator,
	NpmGenerator,
	RepoGenerator,
} from './parseGenerator'
import { Prompts } from './prompts'
import { Actions } from './actions'
import { Data } from './data'
import { Completed } from './completed'
import { Prepare } from './prepare'
import { Plugins } from './plugins'

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
	quiet?: boolean
	/** generator string */
	generator: string | ParsedGenerator
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
	 * User-supplied answers
	 * `true` means using default answers for prompts
	 */
	answers?: Answers
	/** Extra data payload to provide the generator at runtime */
	extras?: T
}

const IDLE = 'idle'
const PREPARE = 'prepare'
const PROMPT = 'prompt'
const DATA = 'data'
const ACTION = 'action'
const COMPLETE = 'complete'

type GenState =
	| typeof IDLE
	| typeof PREPARE
	| typeof PROMPT
	| typeof DATA
	| typeof ACTION
	| typeof COMPLETE

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
	/** Generator config file loaded from */
	config: GeneratorConfig = {}

	private prepare: Prepare
	private prompts: Prompts
	private _data: Data
	private actions: Actions
	private plugins: Plugins
	private completed: Completed

	state: GenState = IDLE

	parsedGenerator: ParsedGenerator

	constructor(opts: GritOptions) {
		this.opts = {
			...opts,
			outDir: path.resolve(opts.outDir || '.'),
			logLevel: opts.logLevel || 3,
			mock: typeof opts.mock === 'boolean' ? opts.mock : false,
			debug: typeof opts.debug === 'boolean' ? opts.debug : false,
		}

		// Set log level from run mode
		if (opts.debug) {
			this.opts.logLevel = 4
		} else if (opts.quiet) {
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
			this.parsedGenerator = parseGenerator(this.opts.generator as string)
		} else {
			const generator = this.opts.generator as NpmGenerator | RepoGenerator
			// Tell the generator what version to update to if update is selected
			if (this.opts.update) generator.version = 'latest'
			this.parsedGenerator = generator
		}

		// Instantiate generator runtime environments
		this.prompts = new Prompts(this)
		this.actions = new Actions(this)
		this._data = new Data(this)
		this.completed = new Completed(this)
		this.prepare = new Prepare(this)
		this.plugins = new Plugins({ context: this })
	}

	/**
	 * Get actual generator to run and its config
	 *
	 * Download it if not yet cached
	 */
	async getGenerator(
		generator: ParsedGenerator = this.parsedGenerator
	): Promise<GeneratorConfig> {
		await ensureGeneratorExists(generator, this.opts)

		// Increment the run count of the generator in the store
		this.store.generators.set(
			generator.hash + '.runCount',
			store.generators.get(generator.hash + '.runCount') + 1 || 1
		)

		// load actual generator from generator path
		const loadedConfig = await loadConfig(generator.path)
		const config: GeneratorConfig =
			loadedConfig.path && loadedConfig.data
				? loadedConfig.data
				: defautGeneratorFile

		// set generator config
		this.config = config

		return config
	}

	/**
	 * Run the generator with the configured options
	 * Execures the prepare, prompt, data, actions, and completed sections of a generator config file
	 */
	async runGenerator(config: GeneratorConfig = this.config): Promise<void> {
		if (config.description) {
			logger.status('green', 'Generator', config.description)
		}

		// Run generator prepare
		if (config.prepare) {
			this.state = PREPARE
			await this.prepare.run()
		}

		// Run generator prompt section
		if (config.prompts) {
			this.state = PROMPT
			await this.prompts.run()
		}

		this._data.registerDataProvider(
			await this.plugins.addPluginData(this.prompts.prompts, this.answers)
		)

		// Run generator data section
		if (config.data) {
			this.state = DATA
			await this._data.run()
		}

		// Run generator actions section
		if (config.actions) {
			this.state = ACTION
			await this.actions.run()
		}

		this.actions.registerActionProvider(await this.plugins.addPluginActions())

		// Run generator completed section
		if (!this.opts.mock && config.completed) {
			this.state = COMPLETE
			await this.completed.run()
		}
	}

	/** Method to run when instantiated with a generator */
	async run(): Promise<void> {
		await this.runGenerator(await this.getGenerator())
		this.state = IDLE
	}

	setPermissions(
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

	/**
	 * Generator Instance Properties
	 */

	/**
	 * Retrive the answers
	 *
	 * You can't access this in `prompts` function
	 */
	get answers(): { [k: string]: any } {
		this.setPermissions('answers', [PROMPT])
		return this.prompts.answers
	}

	set answers(value: { [k: string]: any }) {
		this.prompts.answers = value
	}

	/**
	 * The combination of answers and data from the data generator methods
	 *
	 * Used to give generator functions more custom data to work with
	 */
	get data(): any {
		this.setPermissions('data', [PREPARE, PROMPT])
		return {
			...this.answers,
			...this._data.data,
		}
	}

	set data(value: { [k: string]: any }) {
		this.prompts.answers = value
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
			return require(path.join(this.parsedGenerator.path, 'package.json'))
		} catch (err) {
			return {}
		}
	}

	/** Get the information of system git user */
	get gitUser(): GitUser {
		return getGitUser(this.opts.mock)
	}

	/** The basename of output directory */
	get projectName(): string {
		return path.basename(this.opts.outDir)
	}

	/** The absolute path to output directory */
	get outDir(): string {
		return path.resolve(this.opts.outDir)
	}

	/** The npm client */
	get npmClient(): NPM_CLIENT {
		return getNpmClient()
	}

	/**
	 * Generator Instance Methods
	 */

	/**	Run `git init` in output directly */
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

	/** Run a git commit with a custom commit message in output directory */
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

	/** Create an Grit Error so we can pretty print the error message instead of showing full error stack */
	createError(message: string): GritError {
		return new GritError(message)
	}

	/** Testing Helpers */

	/** Get file list of output directory */
	async getOutputFiles(): Promise<string[]> {
		const files = await glob(['**/*', '!**/node_modules/**', '!**/.git/**'], {
			cwd: this.opts.outDir,
			dot: true,
			onlyFiles: true,
		})
		return files.sort()
	}

	/** Check if a file exists in output directory */
	async hasOutputFile(file: string): Promise<boolean> {
		return await pathExists(path.join(this.opts.outDir, file))
	}

	/** Read a file in output directory */
	async readOutputFile(file: string): Promise<string> {
		return await readFile(path.join(this.opts.outDir, file), 'utf8')
	}
}
