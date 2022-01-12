import { cli } from './config'
import { home, help, generate, find, exit } from './routes'

export const runCLI = async (): Promise<void> => {
	cli
		.addRoute('home', home)
		.addRoute('generate', generate)
		.addRoute('help', help)
		.addRoute('exit', exit)
		.addRoute('find', find)

	// List command for listing your generators
	cli.commander.command('find').action(() => cli.navigate('find'))

	// Help command to get some tips and resources
	cli.commander.command('help').action(() => cli.navigate('help'))

	// Running a generator with the cli directly
	cli.commander
		.arguments('[generator] [outDir]')
		.option('-d, --debug', 'run the generator with more logging')
		.option('-u, --update', 'force generator update')
		.option('-s, --silent', 'run the generator without any logging')
		.option('-c, --clone', 'git clone repo instead of downloading it')
		.option('-m, --mock', 'mock the generator for testing purposes')
		.option('--hot-rebuild', 'rebuild a local generator when changes are made')
		// .option('--answers <answers>', 'inject answers into the generator')
		.option('--registry', 'use preferred npm registry (yarn, npm)')
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
