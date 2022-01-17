import { cli } from './config'
import {
	home,
	help,
	generate,
	find,
	exit,
	install,
	remove,
	update,
} from './routes'

export const runCLI = async (): Promise<void> => {
	cli
		.addRoute('home', home)
		.addRoute('generate', generate)
		.addRoute('install', install)
		.addRoute('update', update)
		.addRoute('remove', remove)
		.addRoute('help', help)
		.addRoute('exit', exit)
		.addRoute('find', find)

	// List command for listing your generators
	cli.commander.command('find').action(async () => await cli.navigate('find'))

	// install command for installing a generator
	cli.commander
		.command('install')
		.argument('<generator>', 'The name of the generator to install')
		.action(async () => await cli.navigate('install'))

	// update command for updating a generator
	cli.commander
		.command('update')
		.argument('[generator]', 'The name of the generator to install')
		.option('-a, --all', 'Update all generators')
		.action(async () => await cli.navigate('update'))

	// remove command for removing a generator
	cli.commander
		.command('remove')
		.argument('[generator]', 'The name of the generator to install')
		.action(async () => await cli.navigate('remove'))

	// Help command to get some tips and resources
	cli.commander.command('help').action(async () => await cli.navigate('help'))

	// Running a generator with the cli directly
	cli.commander
		.arguments('[generator] [outDir]')
		.option('-d, --debug', 'run the generator with more logging')
		.option('-u, --update', 'force generator update')
		.option('-s, --silent', 'run the generator without any logging')
		.option('-c, --clone', 'git clone repo instead of downloading it')
		.option('-m, --mock', 'mock the generator for testing purposes')
		.option(
			'-h, --hot-rebuild',
			'rebuild a local generator when changes are made'
		)
		// .option('--answers <answers>', 'inject answers into the generator')
		.option(
			'--npm-client <client>',
			`use a specific npm client ('yarn', 'npm')`
		)
		.option('-n, --skip-install', 'skip installing dependencies')
		.action(async () => {
			if (cli.commander.args.length === 0) {
				await cli.navigate('home')
			} else {
				await cli.navigate('generate')
			}
		})

	await cli.run()
}
