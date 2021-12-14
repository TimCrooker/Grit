import { GritRoute } from '@/cli/config'
import { Terror } from '@/utils/error'
import { getGenerator } from 'gritenv'

/**
 * Run the generator that was directly called from the command line
 */
export const generate: GritRoute = async (app, { args, options }) => {
	const generator = args[0]
	const outDir = args[1]

	if (!generator) {
		throw new Terror('You must specify a generator to run')
	}

	await (
		await getGenerator(
			{
				generator: generator,
				outDir: outDir || '.',
				answers: options.answers,
				...options,
			},
			options.forceNewest
		)
	).run()
}
