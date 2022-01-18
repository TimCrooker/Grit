import { GritRoute } from '@/cli/config'
import { getGenerator } from 'gritenv'

/**
 * Run the generator that was directly called from the command line
 */
export const generate: GritRoute = async (app, { args, options }) => {
	const generator = args[1]
	const outDir = args[2]

	if (!generator) {
		throw new app.error('You must specify a generator to run')
	}

	const grit = await getGenerator({
		generator: generator,
		outDir: outDir || '.',
		answers: options.answers,
		...options,
	})

	await grit.run()
}
