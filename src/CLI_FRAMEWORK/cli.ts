import chalk from 'chalk'
import inquirer, { Answers, QuestionCollection } from 'inquirer'
import updateNotifier, { Package } from 'update-notifier'
import { logger } from './logger'
import { commander } from './commander'
import { Route, Router, RouterOptions } from './router'

export interface CLIOptions<RuntimeEnvInstance = any> {
	pkg: Package
	debug?: boolean
	/** renders cli output  */
	// testMode?: boolean
	env?: RuntimeEnvInstance
}

export class CLI<RuntimeEnvInstance = any> {
	opts: CLIOptions
	env: RuntimeEnvInstance

	private router: Router<RuntimeEnvInstance>
	logger = logger
	commander = commander
	inquirer = inquirer

	constructor(opts: CLIOptions) {
		this.opts = {
			...opts,
			debug: opts.debug || false,
			// testMode: opts.testMode || false,
		}

		// Set the runtime enviroment
		this.env = opts.env

		// Configure logger
		this.logger.options = { logLevel: opts.debug ? 4 : 1, mock: false }

		// Configure CLI router
		const routerOpts = { logger: this.logger } as RouterOptions
		this.router = new Router(routerOpts)

		// Add autocomplete prompts to inquirer
		inquirer.registerPrompt(
			'autocomplete',
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('inquirer-autocomplete-prompt')
		)
	}

	async run(): Promise<void> {
		this.logger.debug('CLI running...')

		this.updateCheck()

		this.commander.parse()
	}

	/** Check for updates and inform the user if there are any */
	updateCheck(pkg = this.opts.pkg): void {
		const notifier = updateNotifier({ pkg })
		const message = []

		if (notifier.update) {
			message.push(
				'Update available: ' +
					chalk.green.bold(notifier.update.latest) +
					chalk.gray(' (current: ' + notifier.update.current + ')'),
				'Run ' + chalk.magenta('npm install -g ' + pkg.name) + ' to update.'
			)
			console.log(message.join(' '))
		}
	}

	/** Add a CLI Route */
	addRoute(route: string, handler: Route<RuntimeEnvInstance>): this {
		this.router.registerRoute(route, handler)
		return this
	}

	// Navigate to a route
	async navigate(routeName: string): Promise<void> {
		console.clear()
		// get options from commander
		const options = this.commander.opts()

		const args = this.commander.args

		await this.router.navigate(routeName, { args: args, options }, this)
	}

	async prompt(
		questions: QuestionCollection,
		initialAnswers?: Partial<Answers>
	): Promise<Answers> {
		return await this.inquirer.prompt(questions, initialAnswers)
	}
}
