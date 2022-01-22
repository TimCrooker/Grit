import { colors } from 'swaglog'
import { Terror } from '@/utils/error'
import { spinner } from '@/utils/spinner'
import { NpmGenerator, parseGenerator, RepoGenerator, store } from 'gritenv'

/**
 * Run the generator that was directly called from the command line
 */
export const install = async (generatorName: string): Promise<void> => {
	const generator = parseGenerator(generatorName) as
		| NpmGenerator
		| RepoGenerator

	const alreadyInstalled = store.generators.get(generator.hash)

	// If the generator is already installed, we will let the user know and exit
	if (alreadyInstalled) {
		throw new Terror('Generator already installed')
	}

	// If the generator is not installed, we will install it
	try {
		spinner.start(`Installing ${colors.cyan('grit-' + generatorName)}`)
		await store.generators.add(generator)
		spinner.succeed(
			`Succesfully installed ${colors.cyan('grit-' + generatorName)}`
		)
	} catch (e) {
		spinner.stop()
		throw e
	}
}
