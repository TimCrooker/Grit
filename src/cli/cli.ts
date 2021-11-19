import pkg from '@/../package.json'
import { CLI, CLIOptions } from '@/CLI_FRAMEWORK/cli'
import { generate } from './routes/generate'
import { exit, find, help, home } from './routes'
import { Route } from '../CLI_FRAMEWORK/router'
import { checkPkgForUpdates } from './utils/updater'
import { Grit } from '@/generator/index'

export type RuntimeEnv = Grit

export type GritRoute = Route<RuntimeEnv>

export const runCLI = async (): Promise<void> => {
	const debugMode = process.env.NODE_ENV === 'development'

	const cliOpts = {
		pkg,
		debug: debugMode,
	} as CLIOptions

	const cli = new CLI(cliOpts)

	!debugMode && console.clear()

	cli.logger.log(await checkPkgForUpdates(pkg))

	cli
		.addRoute('home', home)
		.addRoute('generate', generate)
		.addRoute('help', help)
		.addRoute('exit', exit)
		.addRoute('find', find)

	cli.commander.name('grit').version(pkg.version)

	/**
	 * Command routes
	 */

	// List command for listing your generators
	cli.commander.command('find').action(() => cli.navigate('find'))

	// Help command to get some tips and resources
	cli.commander.command('help').action(() => cli.navigate('help'))

	// Running a generator or using the helper
	cli.commander
		.arguments('[generator] [outDir]')
		.option('-d, --debug', 'run the generator with more logging')
		.option('-u, --update', 'force generator update')
		.option('-c, --clone', 'git clone repo instead of downloading it')
		.option('-y, --yes', 'uses default answers for all generator questions')
		.option(
			'--npm-client <client>',
			`use a specific npm client ('yarn', 'npm')`
		)
		.option('--skip-install', 'skip installing dependencies')
		.action(() => {
			if (cli.commander.args.length === 0) {
				cli.navigate('home')
			} else {
				cli.navigate('generate')
			}
		})

	await cli.run()
}
