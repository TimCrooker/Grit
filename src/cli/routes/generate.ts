import { handleError } from '@/error'
import { Grit, GritOptions } from '@/generator'
import { logger } from '@/logger'
import { GritRoute } from '../cli'

export const generate: GritRoute = async (app, { args, options }) => {
	const generator = args[0]
	const outDir = args[1]

	logger.debug('Generator command', generator, outDir, options)

	const gritOptions = {
		generator,
		outDir: outDir || '.',
		answers: options.yes ? true : options.answers,
		...options,
	} as GritOptions

	try {
		await new Grit(gritOptions).run()
	} catch (error) {
		handleError(error)
	}
}
