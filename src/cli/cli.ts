import { Grit } from '@/generator'
import pkg from '@/../package.json'
import { CLI, CLIOptions } from '@/CLI_FRAMEWORK/cli'
import { generate } from './routes/generate'
import { exit, find, help, home } from './routes'
import { Route } from '../CLI_FRAMEWORK/router'

export type RuntimeEnv = Grit

export type GritRoute = Route<RuntimeEnv>

export const runCLI = async (): Promise<void> => {
	// console.clear()

	const cliOpts = {
		pkg,
		debug: true,
	} as CLIOptions

	const cli = new CLI(cliOpts)

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
