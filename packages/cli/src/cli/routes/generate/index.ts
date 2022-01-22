import { logger } from 'swaglog'
import { getGenerator } from 'gritenv'

export type GeneratorOptions = {
	debug?: boolean
	update?: boolean
	silent?: boolean
	clone?: boolean
	mock?: boolean
	hotRebuild?: boolean
	npmClient?: 'yarn' | 'npm'
	skipInstall?: boolean
}

/**
 * Run the generator that was directly called from the command line
 */
export const generate = async (
	generator: string,
	outDir?: string,
	options: GeneratorOptions = {}
): Promise<void> => {
	logger.debug('generator', generator, 'outDir', outDir, 'options', options)

	if (!generator) {
		// throw new app.error('You must specify a generator to run')
	}

	const grit = await getGenerator({
		generator: generator,
		outDir: outDir || '.',
		...options,
	})

	await grit.run()
}
