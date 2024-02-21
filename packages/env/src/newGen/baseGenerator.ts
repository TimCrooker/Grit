import { Command } from 'commander'
import { Logger } from 'swaglog'

interface GeneratorMetadata {
	name: string
	version: string
	description: string
	// Add any other metadata fields as needed
}

interface BaseOptions {
	debug: boolean
}

// TOptions is a generic type representing the shape of the CLI options
abstract class BaseGenerator<
	TOptions extends BaseOptions = BaseOptions,
	TData extends TOptions = TOptions
> {
	protected program: Command
	/** A defined set of CLI available options. This is generally a partial match with the data type of TData. Any options defined here should be callable by the CLI with option flags. These answered values will then be merged with the data at execution time to satisfy the answer to any prompts using that data */
	protected options: TOptions = {} as TOptions
	protected data: TData = {} as TData
	private metadata: GeneratorMetadata
	protected debug = false

	logger: Logger = new Logger({
		logLevel: 1,
		mock: false,
	})

	constructor(metadata: GeneratorMetadata) {
		this.program = new Command()
		this.metadata = metadata
		this.setup()
		this.registerBaseCLICommands()
		this.registerCLICommands(this.program)
	}

	private setup(): void {
		this.program
			.name(this.metadata.name)
			.description(this.metadata.description)
			.version(this.metadata.version)
	}

	// Register global CLI options for all generators
	private registerBaseCLICommands(): void {
		this.program.option('-d, --debug', 'Enable debug mode')
	}

	private handleBaseOptions(): void {
		if (this.options.debug) {
			this.setDebugMode(true)
		}

		this.mergeOptionsIntoData()
	}

	// Register the available CLI commands for the generator
	protected abstract registerCLICommands(commander: Command): void

	/* LIFECYCLE METHODS */
	protected abstract generate(): Promise<void> | void

	private async executeLifecycle(): Promise<void> {
		await this.generate()
	}

	public async run(argv?: string[]): Promise<void> {
		// If argv is provided, parse the command-line arguments
		if (argv) {
			this.program.parse(argv)
			this.options = this.program.opts() as TOptions
			this.handleBaseOptions()
		}

		await this.executeLifecycle()
	}

	/* GETTERS */

	/* SETTERS */

	setDebugMode(debug: boolean): void {
		this.debug = debug
		this.logger.setOptions({ logLevel: debug ? 4 : 1 })
	}

	/* HELPER METHODS */

	private mergeOptionsIntoData(): void {
		// Merges CLI options into the global data store. This is useful for answering prompts with CLI options
		Object.assign(this.data, this.options)
	}
}

export default BaseGenerator
