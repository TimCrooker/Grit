import Table from 'cli-table3'
import { generatorStore } from '../store/generatorStore'
import { RepoGenerator, NpmGenerator } from '../generator/parseGenerator'

export function getRepoGeneratorName(generator: RepoGenerator): string {
	return `${generator.prefix === 'github' ? '' : `${generator.prefix}:`}${
		generator.user
	}/${generator.repo}`
}

export function getNpmGeneratorName(generator: NpmGenerator): string {
	return generator.name.replace('sao-', '')
}

export function printGenerators(): void {
	const table = new Table({
		head: ['Name', 'Versions'],
	})

	for (const [name, generators] of generatorStore.groupedGenerators) {
		table.push([name, generators.map((g) => `${g.version}`).join(', ')])
	}

	console.log(table.toString())
}
