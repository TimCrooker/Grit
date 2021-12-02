import { Grit, GritOptions } from '@/generator'
import { GeneratorConfig } from '@/index'
import { store } from '@/store'
import { pathExists } from '@/utils/files'
import path from 'path'
import { ensureGeneratorExists } from '../ensureGenerator'
import { loadConfig } from '../generatorConfig'
import { defautGeneratorFile } from '../generatorConfig/default-generator'
import {
	NpmGenerator,
	ParsedGenerator,
	parseGenerator,
	RepoGenerator,
} from '../parseGenerator'

/**
 * Load local version of grit for npm packages and local generators
 * if none is found, load the newest version one
 */
export const loadGeneratorGrit = async (
	generator: ParsedGenerator
): Promise<typeof Grit> => {
	//load the generators installed version of grit generator
	let gritPath = path.resolve(generator.path, '../grit-cli/dist/index.js')

	if (generator.type === 'local') {
		gritPath = path.resolve(
			generator.path,
			'node_modules/grit-cli/dist/index.js'
		)
	}

	// if gritPath is valid then import it and return the grit object
	if (await pathExists(gritPath)) {
		const { Grit } = await import(gritPath)
		return Grit
	}

	return Grit
}

interface GetGeneratorOptions
	extends Omit<GritOptions, 'parsedGenerator' | 'config'> {
	generator: ParsedGenerator | string
}

/**
 * Get actual generator to run and its config
 *
 * Download it if not yet cached
 */
export const getGenerator = async (
	opts: GetGeneratorOptions
): Promise<Grit> => {
	let parsedGenerator: ParsedGenerator
	// use directly passed parsed generator or parse generator string
	if (typeof opts.generator === 'string') {
		parsedGenerator = parseGenerator(opts.generator as string)
	} else {
		parsedGenerator = opts.generator as NpmGenerator | RepoGenerator
		// Tell the generator what version to update to if update is selected
		// if (this.opts.update) generator.version = 'latest'
	}

	await ensureGeneratorExists(parsedGenerator, opts.update)

	// Increment the run count of the generator in the store
	store.generators.set(
		parsedGenerator.hash + '.runCount',
		store.generators.get(parsedGenerator.hash + '.runCount') + 1 || 1
	)

	// load actual generator from generator path
	const loadedConfig = await loadConfig(parsedGenerator.path)
	const Gen = await loadGeneratorGrit(parsedGenerator)
	const config: GeneratorConfig =
		loadedConfig.path && loadedConfig.data
			? loadedConfig.data
			: defautGeneratorFile

	return new Gen({ ...opts, config: config, parsedGenerator: parsedGenerator })
}
