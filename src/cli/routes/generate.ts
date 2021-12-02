import { GritError, handleError } from '@/error'
import { logger } from '@/logger'
import { GritRoute } from '../cli'
import { getGenerator } from '../utils/getGenerator'

export const generate: GritRoute = async (app, { args, options }) => {
	const generator = args[0]
	const outDir = args[1]

	logger.debug('Generator command', generator, outDir, options)

	try {
		await (
			await getGenerator({
				generator: generator,
				outDir: outDir || '.',
				answers: options.yes ? true : options.answers,
				...options,
			})
		).run()
	} catch (e) {
		if (e instanceof GritError || e instanceof Error) {
			handleError(e)
		}
	}
}
