import {
	NpmGenerator,
	RepoGenerator,
	ParsedGenerator,
} from '@/generator/parseGenerator'
import { BaseStoreOptions, BaseStore } from '../baseStore'

export type GroupedGenerators = Map<string, NpmGenerator | RepoGenerator>

type GeneratorStoreOptions = BaseStoreOptions

export class GeneratorStore extends BaseStore<ParsedGenerator> {
	constructor(options?: GeneratorStoreOptions) {
		super({ ...options })
	}

	/** Add a new generator to the store if it doesn't already exist */
	add(generator: ParsedGenerator): this {
		this.set(generator.hash, generator, false)
		return this
	}

	/** Search the store for generators matching the current one's name */
	getAllByName(generator: ParsedGenerator): ParsedGenerator[] {
		return this.getAllWhere((key, value) => {
			if (generator.type === 'repo' && value.type === 'repo') {
				return (
					`${value.prefix}:${value.user}/${value.repo}` ===
					`${generator.prefix}:${generator.user}/${generator.repo}`
				)
			}
			if (generator.type === 'npm' && value.type === 'npm') {
				return generator.name === value.name
			}
			return false
		})
	}

	/** Group generators by name */
	get generatorNameList(): GroupedGenerators {
		const generatorsMap: GroupedGenerators = new Map()
		this.listify().forEach((generator) => {
			if (generator.type === 'repo') {
				const repoGenerator = generator as RepoGenerator
				const repoGeneratorName = getRepoGeneratorName(repoGenerator)
				if (!generatorsMap.has(repoGeneratorName)) {
					generatorsMap.set(repoGeneratorName, repoGenerator)
				}
			}
			if (generator.type === 'npm') {
				const npmGenerator = generator as NpmGenerator
				const npmGeneratorName = getNpmGeneratorName(npmGenerator)
				if (!generatorsMap.has(npmGeneratorName)) {
					generatorsMap.set(npmGeneratorName, npmGenerator)
				}
			}
		})
		return generatorsMap
	}
}

export const generatorStore = new GeneratorStore({
	storeFileName: 'generators.json',
})
