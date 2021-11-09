import { exec } from 'child_process'
import spawn from 'cross-spawn'
import { glob } from 'majo'
import { tmpdir } from 'os'
import path from 'path'
import { SetRequired } from 'type-fest'
import { promisify } from 'util'
import { getGitUser, GitUser } from './utils/git-user'
import { defautGeneratorFile } from './generator/default-generator'
import { handleError, GritError } from './error'
import {
	getNpmClient,
	InstallOptions,
	installPackages,
	NPM_CLIENT,
	runNpmScript,
	RunNpmScriptOptions,
} from './utils/cmd'
import { store } from './store'
import { ensureGeneratorExists } from './generator/validateGenerator'
import { ParsedGenerator, parseGenerator } from './generator/parseGenerator'
import { logger, colors } from './logger'
import { spinner } from './spinner'
import { APP_NAME } from './config'
import { pathExists, readFile } from './utils/files'
import { updater } from './cli/updater'
import { GeneratorConfig, loadConfig } from './generator/generator-config'
import { Answers } from './utils/prompt/answers'

export interface Options<T = { [k: string]: any }> {
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
	generator: string
	/** Update cached generator before running */
	updateGenerator?: boolean
	/** Use `git clone` to download repo */
	clone?: boolean
	/** Use a custom npm registry */
	registry?: string
	/** Check for grit /generator updates */
	updateCheck?: boolean
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

const EMPTY_ANSWERS = Symbol()
const EMPTY_DATA = Symbol()

export type Data = Record<string, any>

export class Grit {
	opts: SetRequired<Options, 'outDir' | 'logLevel'>
	spinner = spinner
	colors = colors
	logger = logger
	updater = updater
	store = store

	/** Prompt answers provided by the user */
	private _answers: Answers | symbol = EMPTY_ANSWERS
	private _data: Data | symbol = EMPTY_DATA

	parsedGenerator: ParsedGenerator

	constructor(opts: Options) {
		this.opts = {
			...opts,
			outDir: path.resolve(opts.outDir || '.'),
			logLevel: opts.logLevel || 3,
			mock:
				typeof opts.mock === 'boolean'
					? opts.mock
					: process.env.NODE_ENV === 'test',
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

		// configure Updater
		updater.setOptions({
			updateSelf: this.opts.updateCheck,
			updateGenerator: this.opts.updateGenerator,
		})

		// redirect outDir to temp dir when mock mode is enabled
		if (this.opts.mock) {
			this.opts.outDir = path.join(
				tmpdir(),
				`${APP_NAME.toLowerCase()}-out/${Date.now()}/out`
			)
		}

		this.parsedGenerator = parseGenerator(this.opts.generator)
	}

	/**
	 * Get actual generator to run and its config
	 *
	 * Download it if not yet cached
	 */
	async getGenerator(
		generator: ParsedGenerator = this.parsedGenerator
	): Promise<{ generator: ParsedGenerator; config: GeneratorConfig }> {
		await ensureGeneratorExists(generator, this.opts)

		// load actual generator from generator path
		logger.debug(`Loading generator from ${generator.path}`)
		const loadedConfig = await loadConfig(generator.path)
		const config: GeneratorConfig =
			loadedConfig.path && loadedConfig.data
				? loadedConfig.data
				: defautGeneratorFile

		this.store.generators.add(generator)

		return {
			generator,
			config,
		}
	}

	async runGenerator(
		generator: ParsedGenerator,
		config: GeneratorConfig
	): Promise<void> {
		if (config.description) {
			logger.status('green', 'Generator', config.description)
		}

		// Run generator prepare
		if (typeof config.prepare === 'function') {
			await config.prepare.call(this, this)
		}

		// Run generator supplied prompts
		if (config.prompts) {
			const { runPrompts } = await import('./generator/run-prompts')

			this._answers = await runPrompts(this, config)
		} else {
			this._answers = {}
		}

		this._data = config.data ? config.data.call(this, this) : {}

		if (config.actions) {
			const { runActions } = await import('./generator/run-actions')

			await runActions(this, config)
		}

		if (!this.opts.mock && config.completed) {
			await config.completed.call(this, this)
		}
	}

	async run(): Promise<void> {
		const { generator, config } = await this.getGenerator()
		await this.runGenerator(generator, config)
	}

	/** Generator Instance Properties */

	/**
	 * Retrive the answers
	 *
	 * You can't access this in `prompts` function
	 */
	get answers(): { [k: string]: any } {
		if (typeof this._answers === 'symbol') {
			throw new GritError(`You can't access \`.answers\` here`)
		}
		return this._answers
	}

	set answers(value: { [k: string]: any }) {
		this._answers = value
	}

	/**
	 * The combination of answers and data from the data generator methods
	 *
	 * Used to give generator functions more custom data to work with
	 */
	get data(): any {
		if (typeof this._data === 'symbol') {
			throw new GritError(`You can't call \`.data\` here`)
		}
		return {
			...this.answers,
			...this._data,
		}
	}

	/**
	 * Read package.json from output directory
	 *
	 * Returns an empty object when it doesn't exist
	 */
	get pkg(): { [k: string]: any } | undefined {
		try {
			return require(path.join(this.outDir, 'package.json'))
		} catch (err) {
			return {}
		}
	}

	/** Get the information of system git user */
	get gitUser(): GitUser {
		return getGitUser(this.opts.mock)
	}

	/** The basename of output directory */
	get appName(): string {
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

	/** Generator Instance Methods */

	/**	Run `git init` in output directly */
	gitInit(): void {
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

	/** Run any npm script from package.json of the output directory */
	async runScript(opts: Omit<RunNpmScriptOptions, 'cwd'>): Promise<void> {
		if (this.opts.debug){
			logger.debug(`skipping run script`)
			return
		}
		await runNpmScript({ ...opts, cwd: this.outDir })
	}

	/** Display a success message */
	showProjectTips(): void {
		spinner.stop() // Stop when necessary
		logger.success(`Generated into ${colors.underline(this.outDir)}`)
	}

	/** Create an Grit Error so we can pretty print the error message instead of showing full error stack */
	createError(message: string): GritError {
		return new GritError(message)
	}

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

export { runCLI } from './cli/cli'
export { GeneratorConfig, handleError, store }
