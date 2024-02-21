import { logger } from 'swaglog'
import { program } from '@/utils/commander'
import { home, help, generate, find, install, remove, update } from './routes'
import { handleError, Terror } from '@/utils/error'
import { DEBUG } from '@/config'

export const runCLI = async (): Promise<void> => {
	logger.setOptions({
		logLevel: DEBUG ? 4 : 1,
		mock: false,
	})

	logger.debug('CLI running...')

	// Running a generator with the cli directly
	program
		.command('run')
		.argument('<generator>', 'Name of the generator to run')
		.argument('[outDir]', 'Output directory')
		.option('-d, --debug', 'run the generator with more logging')
		.option('-u, --update', 'force generator update')
		.option('-s, --silent', 'run the generator without any logging')
		.option('-c, --clone', 'git clone repo instead of downloading it')
		.option('-m, --mock', 'mock the generator for testing purposes')
		.option(
			'-h, --hot-rebuild',
			'rebuild a local generator when changes are made'
		)
		.option(
			'--npm-client <client>',
			`use a specific npm client ('yarn', 'npm')`
		)
		.option('-n, --skip-install', 'skip installing dependencies')
		.action(generate)

	// install command for installing a generator
	program
		.command('install')
		.argument('<generator>', 'The name of the generator to install')
		.action(install)

	// List command for listing your generators
	program
		.command('find')
		.argument('[keyword]', 'Search for generators by keyword')
		.action(find)

	// update command for updating a generator
	program
		.command('update')
		.argument('[generator]', 'The name of the generator to install')
		.option('-a, --all', 'Update all generators')
		.action(update)

	// remove command for removing a generator
	program
		.command('remove')
		.argument('[generator]', 'The name of the generator to install')
		.action(remove)

	// Help command to get some tips and resources
	program.command('help').action(help)

	// Run the cli home route
	program.action(home)

	try {
		await program.parseAsync(process.argv)
	} catch (e) {
		if (e instanceof Terror || e instanceof Error) {
			handleError(e)
		}
	}
}
