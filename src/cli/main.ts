import { CAC } from 'cac'
import textTable from 'text-table'
import { Options, Grit } from '..'
import { handleError } from '../error'
import { getRepoGeneratorName } from './utils'
import { APP_NAME } from '../config'

export const main =
	(cli: CAC) =>
	async (generator?: string, outDir?: string): Promise<void> => {
		if (cli.options.help) {
			cli.outputHelp()
			return
		}

		// if (!generator) {
		// 	const generatorsMap = generatorStore.groupedGenerators

		// 	if (generatorsMap.size === 0) {
		// 		cli.outputHelp()
		// 		return
		// 	}

		// 	const { name, version } = await prompt([
		// 		{
		// 			name: 'name',
		// 			type: 'select',
		// 			message: 'Select a generator to run',
		// 			choices: [...generatorsMap.keys()],
		// 		},
		// 		{
		// 			name: 'version',
		// 			type: 'select',
		// 			message: 'Found multiple versions, select one',
		// 			default: 'latest',
		// 			skip({ answers: { name } }): boolean {
		// 				const generators = generatorsMap.get(name)
		// 				return !generators || generators.length < 2
		// 			},
		// 			choices({ answers: { name } }): string[] {
		// 				return generatorsMap.get(name)?.map((g) => g.version) || []
		// 			},
		// 		},
		// 	])
		// 	const matched = name && generatorsMap.get(name)
		// 	if (matched) {
		// 		const actualVersion = version || matched[0].version
		// 		return main(cli)(
		// 			`${name}${
		// 				['latest', 'master'].includes(actualVersion)
		// 					? ''
		// 					: `@${actualVersion}`
		// 			}`,
		// 			outDir
		// 		)
		// 	}
		// 	return
		// }


	}
