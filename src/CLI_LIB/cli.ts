import chalk from 'chalk'
import { Command } from 'commander'
import updateNotifier, { Package } from 'update-notifier'
import { Logger } from '../utils/logger'
import { Route, Router, RouterOptions } from './router'

export interface CLIOptions {
	routesPath: string
	pkg: Package
	debug?: boolean
}

export class CLI {
	// Properties
	private router: Router
	pkg: Package
	commander = new Command()
	logger: Logger
	// Flags
	debug: boolean

	constructor(opts: CLIOptions) {
		// Configure CLI router
		const routerOpts = {
			routesPath: opts.routesPath,
		} as RouterOptions
		this.router = new Router(routerOpts)

		this.pkg = opts.pkg // Add CLI package.json file

		this.debug = opts.debug || false // Check for debug mode

		this.logger = new Logger({ logLevel: opts.debug ? 4 : 1 }) // Configure logger
	}

	async run(): Promise<void> {
		this.logger.debug('routes:', this.router.routes)
		this.logger.debug('args', this.commander.args)
		this.logger.debug('commander', this.commander)

		this.commander.parse()
	}

	updateCheck(pkg = this.pkg): void {
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

	/** CLI entry point */

	/** Add a CLI Route */
	addRoute(route: string, handler: Route): this {
		this.router.registerRoute(route, handler)
		return this
	}

	// Navigate to a route
	async navigate(route: string): Promise<void> {
		// get options from commanders
		const options = this.commander.opts()

		const args = this.commander.args

		await this.router.navigate(route, { args: args, options }, this)
	}

	// const cli = cac(APP_NAME)
	// cli
	// 	.command('[generator] [outDir]', 'Run a generator')
	// 	.action((generator, outDir) =>
	// 		import('./main').then((res) => res.main(cli)(generator, outDir))
	// 	)
	// 	.option(
	// 		'--npm-client <client>',
	// 		`Use a specific npm client ('yarn' | 'npm' | 'pnpm')`
	// 	)
	// 	.option('-u, --update', 'Update cached generator')
	// 	.option('-c, --clone', 'Clone repository instead of archive download')
	// 	.option('-y, --yes', 'Use the default value for all prompts')
	// 	.option(
	// 		'--registry <registry>',
	// 		'Use a custom registry for package manager'
	// 	)
	// 	.option(
	// 		'--answers.* [value]',
	// 		'Skip specific prompt and use provided answer instead'
	// 	)
	// 	.option('--debug', 'Display debug logs')
	// 	.option('--version', `Display version`)
	// 	.option('-h, --help', 'Display CLI usages')
	// cli
	// 	.command('list', 'List all downloaded generators')
	// 	.option('-h, --help', 'Display CLI usages')
	// 	.action(() => import('./list').then((res) => res.list()()))
	// cli.parse(process.argv, { run: false })
	// if (cli.options.version && cli.args.length === 0) {
	// 	const pkg = JSON.parse(
	// 		readFileSync(join(__dirname, '../package.json'), 'utf8')
	// 	)
	// 	console.log(`${APP_NAME}: ${pkg.version}`)
	// 	console.log(`node: ${process.versions.node}`)
	// 	console.log(`os: ${process.platform}`)
	// } else if (cli.matchedCommand?.name !== '' && cli.options.help) {
	// 	cli.outputHelp()
	// } else {
	// 	await cli.runMatchedCommand()
	// }
}
