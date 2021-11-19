import { NpmGenerator, RepoGenerator } from '@/generator/parseGenerator'
import { colors, logger } from '@/logger'
import { store } from '@/store'
import { StoreGenerator } from '@/store/generatorStore'
import { checkGeneratorForUpdates } from '@/cli/utils/updater'
import { spinner } from '@/spinner'

export function getRepoGeneratorName(generator: RepoGenerator): string {
	return `${generator.prefix === 'github' ? '' : `${generator.prefix}:`}${
		generator.user
	}/${generator.repo}`
}

export function getNpmGeneratorName(generator: NpmGenerator): string {
	return generator.name.replace(`grit-`, '')
}

interface GeneratorListChoice {
	method: 'run' | 'update'
	generator: StoreGenerator
}

interface GeneratorChoice {
	name: string
	value: GeneratorListChoice
}

type GeneratorList = GeneratorChoice[]

export const generatorChoiceList = async (): Promise<GeneratorList> => {
	spinner.start('Loading your generators')
	const generators: GeneratorList = []
	for (const [name, generator] of store.generators.generatorNameList) {
		const updateInfo = await checkGeneratorForUpdates(generator)
		logger.debug('Check for updates: ' + colors.green(name))
		if (updateInfo) {
			generators.push({
				name: `${name} ${colors.yellow('*Update Available*')} ${
					updateInfo.current
				} => ${updateInfo.latest}`,
				value: {
					method: 'update',
					generator,
				},
			})
		} else {
			generators.push({
				name: `${name} ${colors.yellow(generator.version)}`,
				value: { method: 'run', generator },
			})
		}
	}
	spinner.stop()
	return generators.sort(
		(a, b) => b.value.generator.runCount - a.value.generator.runCount
	)
}
