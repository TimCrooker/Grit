import { GritRoute } from '@/cli/config'
import { NpmGenerator, parseGenerator, RepoGenerator, store } from 'gritenv'

/**
 * Run the generator that was directly called from the command line
 */
export const install: GritRoute = async (app, { args, options }) => {
	const generatorName = args[1]

	const generator = parseGenerator(generatorName) as
		| NpmGenerator
		| RepoGenerator

	const alreadyInstalled = store.generators.get(generator.hash)

	// If the generator is already installed, we will let the user know and exit
	if (alreadyInstalled) {
		throw new app.error('Generator already installed')
	}

	// If the generator is not installed, we will install it
	try {
		app.spinner.start(`Installing ${app.colors.cyan('grit-' + generatorName)}`)
		await store.generators.add(generator)
		app.spinner.succeed(
			`Succesfully installed ${app.colors.cyan('grit-' + generatorName)}`
		)
	} catch (e) {
		app.spinner.stop()
		throw e
	}
}
