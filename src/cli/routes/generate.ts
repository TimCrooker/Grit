import { GritError, handleError } from '@/error'
import { GritRoute } from '../cli'
import { getGenerator } from '../utils/getGenerator'

export const generate: GritRoute = async (app, { args, options }) => {
	const generator = args[0]
	const outDir = args[1]

	try {
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
	} catch (e) {
		if (e instanceof GritError || e instanceof Error) {
			handleError(e)
		}
	}
}
