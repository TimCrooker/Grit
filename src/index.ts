import { exec } from 'child_process'
import spawn from 'cross-spawn'
import { glob } from 'majo'
import { tmpdir } from 'os'
import path from 'path'
import resolveFrom from 'resolve-from'
import { SetRequired } from 'type-fest'
import { promisify } from 'util'
import { getGitUser, GitUser } from './utils/git-user'
import { defautGeneratorFile } from './generator/default-generator'
import { handleError, ProjenError } from './utils/error'
import {
	getNpmClient,
	InstallOptions,
	installPackages,
	NPM_CLIENT,
} from './install-packages'
import { store } from './store'
import {
	ensureLocal,
	ensurePackage,
	ensureRepo,
} from './generator/validateGenerator'
import { ParsedGenerator, parseGenerator } from './generator/parseGenerator'
import { logger, colors } from './utils/logger'
import { spinner } from './utils/spinner'
import { APP_NAME, isLocalPath } from './config'
import { pathExists, readFile } from './utils/files'
import { generatorStore, GeneratorStore } from './store/generatorStore'
import { updater } from './utils/updater'
import {
	GeneratorConfig,
	loadConfig,
} from './generator/generatorConfig/generator-config'

export interface Options<T = { [k: string]: any }> {
	outDir?: string
	logLevel?: number
	debug?: boolean
	/** Least amount of logging to the console */
	quiet?: boolean
	/** Path to generator can be local dir, repo, or npm package */
	generator: string
	/** Update cached generator before running */
	updateGenerator?: boolean
	/** Use `git clone` to download repo */
	clone?: boolean
	/** Use a custom npm registry */
	registry?: string
	/** Check for projen /generator updates */
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
	answers?:
		| boolean
		| {
				[k: string]: any
		  }
	/** Extra data payload to provide the generator at runtime */
	extras?: T
}

const EMPTY_ANSWERS = Symbol()
const EMPTY_DATA = Symbol()

export type Answers = { [k: string]: any }
export type Data = { [k: string]: any }

export class Projen {
	opts: SetRequired<Options, 'outDir' | 'logLevel'>
	spinner = spinner
	colors = colors
	logger = logger
	updater = updater

	/** Prompt answers provided by the user */
	private _answers: Answers | symbol = EMPTY_ANSWERS
	private _data: Data | symbol = EMPTY_DATA

	parsedGenerator: ParsedGenerator
	generatorList: GeneratorStore

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

		// Use default answers when mock mode is enabled and no answers are explicitly provided
		if (this.opts.mock && typeof this.opts.answers === 'undefined') {
			this.opts.answers = true
		}

		this.generatorList = generatorStore
		this.parsedGenerator = parseGenerator(this.opts.generator)

		// Sub generator can only be used in already executed generator outdir
		if (this.parsedGenerator.subGenerator && !this.opts.mock) {
			logger.debug(
				`Setting out directory to process.cwd() since it's a sub generator`
			)
			this.opts.outDir = process.cwd()
		}
	}

	/**
	 * Get the help message for current generator
	 *
	 * Used by Projen CLI, in general you don't want to touch this
	 */
	async getGeneratorHelp(): Promise<string> {
		const { config } = await this.getGenerator()

		let help = ''

		if (config.description) {
			help += `\n${config.description}`
		}

		return help
	}

	/**
	 * Get actual generator to run and its config
	 * Download it if not yet cached
	 */
	async getGenerator(
		generator: ParsedGenerator = this.parsedGenerator,
		hasParent?: boolean
	): Promise<{ generator: ParsedGenerator; config: GeneratorConfig }> {
		// TODO find out what these do
		if (generator.type === 'repo') {
			await ensureRepo(generator, {
				update: this.opts.updateGenerator,
				clone: this.opts.clone,
				registry: this.opts.registry,
			})
		} else if (generator.type === 'npm') {
			await ensurePackage(generator, this.opts)
		} else if (generator.type === 'local') {
			await ensureLocal(generator)
		}

		// store generator in generator cache
		if (!hasParent) {
			this.generatorList.add(generator)
		}

		// load actual generator from generator path
		logger.debug(`Loading generator from ${generator.path}`)
		const loadedConfig = await loadConfig(generator.path)
		const config: GeneratorConfig =
			loadedConfig.path && loadedConfig.data
				? loadedConfig.data
				: defautGeneratorFile

		// Only run following code for root generator
		if (!hasParent) {
			if (this.opts.updateCheck) {
				this.updater.checkGenerator(generator, config.updateCheck)
			}
			// Keep the generator info
			store.set(`generators.${generator.hash}`, generator)
		}

		if (generator.subGenerator && config.subGenerators) {
			const subGenerator = config.subGenerators.find(
				(g) => g.name === generator.subGenerator
			)
			if (subGenerator) {
				let generatorPath = subGenerator.generator
				generatorPath = isLocalPath(generatorPath)
					? path.resolve(generator.path, generatorPath)
					: resolveFrom(generator.path, generatorPath)
				return this.getGenerator(parseGenerator(generatorPath), true)
			}
			throw new ProjenError(
				`No such sub generator in generator ${generator.path}`
			)
		}

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
			const { runPrompts } = await import('./generator/prompts/run-prompts')

			this._answers = await runPrompts(this, config)
		} else {
			this._answers = {}
		}

		this._data = config.data ? config.data.call(this, this) : {}

		if (config.actions) {
			const { runActions } = await import('./generator/actions/run-actions')

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

	/**
	 * Retrive the answers
	 *
	 * You can't access this in `prompts` function
	 */
	get answers(): { [k: string]: any } {
		if (typeof this._answers === 'symbol') {
			throw new ProjenError(`You can't access \`.answers\` here`)
		}
		return this._answers
	}

	set answers(value: { [k: string]: any }) {
		this._answers = value
	}

	get data(): any {
		if (typeof this._data === 'symbol') {
			throw new ProjenError(`You can't call \`.data\` here`)
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
	get pkg(): any {
		try {
			return require(path.join(this.outDir, 'package.json'))
		} catch (err) {
			return {}
		}
	}

	/**
	 * Get the information of system git user
	 */
	get gitUser(): GitUser {
		return getGitUser(this.opts.mock)
	}

	/**
	 * The basename of output directory
	 */
	get outDirName(): string {
		return path.basename(this.opts.outDir)
	}

	/**
	 * The absolute path to output directory
	 */
	get outDir(): string {
		return this.opts.outDir
	}

	/**
	 * The npm client
	 */
	get npmClient(): NPM_CLIENT {
		return getNpmClient()
	}

	/**
	 * Run `git init` in output directly
	 *
	 * It will fail silently when `git` is not available
	 */
	gitInit(): void {
		if (this.opts.mock) {
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

	async gitCommit(commitMessage?: string): Promise<void> {
		if (this.opts.mock) return

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

	/**
	 * Run `npm install` in output directory
	 */
	async npmInstall(
		opts?: Omit<InstallOptions, 'cwd' | 'registry'>
	): Promise<{ code: number }> {
		if (this.opts.mock) {
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

	/**
	 * Display a success message
	 */
	showProjectTips(): void {
		spinner.stop() // Stop when necessary
		logger.success(`Generated into ${colors.underline(this.outDir)}`)
	}

	/**
	 * Create an Projen Error so we can pretty print the error message instead of showing full error stack
	 */
	createError(message: string): ProjenError {
		return new ProjenError(message)
	}

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
	 * Read a file in output directory
	 * @param file file path
	 */
	async readOutputFile(file: string): Promise<string> {
		return await readFile(path.join(this.opts.outDir, file), 'utf8')
	}
}

export { runCLI } from './cliEngine'
export { GeneratorConfig, handleError, store, GeneratorStore }
