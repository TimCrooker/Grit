import { getNpmGeneratorName, getRepoGeneratorName } from '../../cmd/utils'
import { GENERATORS_CACHE_PATH } from '../../config'
import {
	NpmGenerator,
	RepoGenerator,
	ParsedGenerator,
} from '../../generator/parseGenerator'
import { Store, StoreOptions } from '..'

export type GroupedGenerators = Map<string, Array<NpmGenerator | RepoGenerator>>

type GeneratorStoreOptions = StoreOptions

export class GeneratorStore extends Store<ParsedGenerator> {
	constructor(options: GeneratorStoreOptions) {
		super({ ...options })
	}

	/** Add a new generator to the store if it doesn't already exist */
	add(generator: ParsedGenerator): void {
		this.set(generator.hash, generator, false)
	}

	/**
	 * Search the store for generators matching the current one's name
	 */
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

	/**
	 * Group generators by name
	 */
	get groupedGenerators(): GroupedGenerators {
		const generatorsMap: GroupedGenerators = new Map()
		Object.entries(this.data).forEach(([, generator]) => {
			if (generator.type === 'npm') {
				const name = getNpmGeneratorName(generator)
				const arr = generatorsMap.get(name) || []
				arr.push(generator)
				generatorsMap.set(generator.name, arr)
			} else if (generator.type === 'repo') {
				const name = getRepoGeneratorName(generator)
				const arr = generatorsMap.get(name) || []
				arr.push(generator)
				generatorsMap.set(name, arr)
			}
		})
		return generatorsMap
	}
}

export const generatorStore = new GeneratorStore({
	storePath: GENERATORS_CACHE_PATH,
	storeFileName: 'generator-list.json',
})
