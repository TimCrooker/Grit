import Table from 'cli-table3'
import { RepoGenerator, NpmGenerator } from '../Generator/parseGenerator'
import { generatorStore } from '../Store/generatorStore'

export function getRepoGeneratorName(generator: RepoGenerator): string {
	return `${generator.prefix === 'github' ? '' : `${generator.prefix}:`}${
		generator.user
	}/${generator.repo}`
}

export function getNpmGeneratorName(generator: NpmGenerator): string {
	return generator.name.replace(`grit-`, '')
}

// export function printGenerators(): void {
// 	const table = new Table({
// 		head: ['Name', 'Versions'],
// 	})

// 	for (const [name, generators] of generatorStore.generatorNameList) {
// 		table.push([name, generators.map((g) => `${g.version}`).join(', ')])
// 	}

// 	console.log(table.toString())
// }
