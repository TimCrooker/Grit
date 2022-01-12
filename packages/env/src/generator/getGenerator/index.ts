import { CONFIG_FILE_NAME } from '@/config'
import JoyCon from 'joycon'
import path from 'path'
import { logger } from 'swaglog'
import { globalRequire, pathExists } from 'youtill'
import { Grit, GritOptions } from '..'
import { Generator } from '../createGenerator'
import { defaultGeneratorFile } from '../defaultGenerator'
import { ensureGenerator } from '../ensureGenerator'
import { GeneratorConfig } from '../generatorConfig'
import {
	NpmGenerator,
	ParsedGenerator,
	parseGenerator,
	RepoGenerator,
} from '../parseGenerator'

/*********************TYPES**********************/

interface GetGeneratorOptions extends Omit<GritOptions, 'config'> {
	forceNewest?: boolean
	update?: boolean
}

/*********************METHODS**********************/

const joycon = new JoyCon({
	files: CONFIG_FILE_NAME,
})

/**
 * load the generator config file
 *
 * takes in a path to the directory of the generator and will find the config file and return it
 */
const loadGenerator = async (
	cwd: string
): Promise<{ filePath?: string; data?: Generator }> => {
	logger.debug('loading generator from path:', cwd)
	const { path: filePath } = await joycon.load({
		cwd,
		stopDir: path.dirname(cwd),
	})
	const data = filePath ? await globalRequire(filePath) : undefined

	return { filePath, data }
}

/** Check generator has config file */
const hasGeneratorConfig = (cwd: string): boolean => {
	return Boolean(
		joycon.resolve({
			cwd,
			stopDir: path.dirname(cwd),
		})
	)
}

/**
 * Get actual generator to run and its config
 *
 * Download it if not yet cached
 */
const getGenerator = async (opts: GetGeneratorOptions): Promise<Grit> => {
	let parsedGenerator: ParsedGenerator
	// use directly passed parsed generator or parse generator string
	if (typeof opts.generator === 'string') {
		parsedGenerator = parseGenerator(opts.generator as string)
	} else {
		parsedGenerator = opts.generator as NpmGenerator | RepoGenerator
	}

	// ensure generator is availiable to use
	await ensureGenerator(parsedGenerator, opts.update)

	// load actual generator from generator path
	const generator = await loadGenerator(parsedGenerator.path)
	if (!generator.filePath || !generator.data) {
		return new Grit({
			...opts,
			config: defaultGeneratorFile,
			generator: parsedGenerator,
		})
	}

	return generator.data.getGeneratorInstance({
		...opts,
		generator: parsedGenerator,
	})
}

/*********************EXPORTS**********************/

export { loadGenerator, hasGeneratorConfig }

export { getGenerator }
