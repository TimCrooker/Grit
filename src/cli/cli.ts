import { Grit } from '../'
import pkg from '../../package.json'
import { CLI, CLIOptions } from '../CLI_FRAMEWORK/cli'
import { exit } from './routes/exit'
import { generate } from './routes/generate'
import { help } from './routes/help'
import { home } from './routes/home'
import { install } from './routes/install'
import { list } from './routes'
import { Route } from '../CLI_FRAMEWORK/router'
import { find } from './routes/find'

export type RuntimeEnv = Grit

export type GritRoute = Route<RuntimeEnv>

export const runCLI = async (): Promise<void> => {
	const cliOpts = {
		pkg,
		debug: true,
	} as CLIOptions

	const cli = new CLI(cliOpts)

	cli
		.addRoute('home', home)
		.addRoute('generate', generate)
		.addRoute('install', install)
		.addRoute('help', help)
		.addRoute('list', list)
		.addRoute('exit', exit)
		.addRoute('find', find)

	/**
	 * Command routes
	 */

	// List command for listing your generators
	cli.commander
		.name('grit')
		.version(pkg.version)
		.command('list')
		.action(() => cli.navigate('list'))

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

// if running with ts-node this runs the cli so we dont have to recompile every time
if (__filename.includes('src')) runCLI()
