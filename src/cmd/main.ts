import { CAC } from 'cac'
import textTable from 'text-table'
import { Options, Grit } from '..'
import { handleError } from '../utils/error'
import { getRepoGeneratorName } from './utils'
import { prompt } from '../generator/prompts'
import { generatorStore } from '../store/generatorStore'
import { APP_NAME } from '../config'

export const main =
	(cli: CAC) =>
	async (generator?: string, outDir?: string): Promise<void> => {
		if (cli.options.help) {
			cli.outputHelp()
			return
		}

		if (!generator) {
			const generatorsMap = generatorStore.groupedGenerators

			if (generatorsMap.size === 0) {
				cli.outputHelp()
				return
			}

			const { name, version } = await prompt([
				{
					name: 'name',
					type: 'select',
					message: 'Select a generator to run',
					choices: [...generatorsMap.keys()],
				},
				{
					name: 'version',
					type: 'select',
					message: 'Found multiple versions, select one',
					default: 'latest',
					skip({ answers: { name } }): boolean {
						const generators = generatorsMap.get(name)
						return !generators || generators.length < 2
					},
					choices({ answers: { name } }): string[] {
						return generatorsMap.get(name)?.map((g) => g.version) || []
					},
				},
			])
			const matched = name && generatorsMap.get(name)
			if (matched) {
				const actualVersion = version || matched[0].version
				return main(cli)(
					`${name}${
						['latest', 'master'].includes(actualVersion)
							? ''
							: `@${actualVersion}`
					}`,
					outDir
				)
			}
			return
		}

		const options: Options = {
			generator,
			outDir: outDir || '.',
			updateCheck: true,
			answers: cli.options.yes ? true : cli.options.answers,
			...cli.options,
		}
		try {
			const grit = new Grit(options)
			const g = grit.parsedGenerator
			if (cli.options.help) {
				const { config } = await grit.getGenerator()
				const prompts =
					typeof config.prompts === 'function'
						? await config.prompts.call(grit, grit)
						: config.prompts
				const answerFlags =
					prompts &&
					textTable(
						prompts.map((prompt) => {
							return [
								`  --answers.${prompt.name}${
									prompt.type === 'confirm' ? '' : ` <value>`
								}`,
								`${prompt.message}`,
							]
						})
					)
				cli.globalCommand.helpCallback = (
					sections
				): Array<{ title?: string; body: string }> => {
					sections = sections
						.map((section) => {
							if (section.title === 'Usage') {
								section.body = section.body.replace(
									'<generator>',
									g.type === 'local'
										? g.path
										: g.type === 'npm'
										? g.name.replace(`${APP_NAME}-`, '')
										: getRepoGeneratorName(g)
								)
							}
							if (section.title === 'Options') {
								section.title = 'Shared Options'
								section.body = section.body.replace(
									/^\s+--answers\.\*[^\n]+\n/m,
									''
								)
							}
							return section
						})
						.filter((section) => {
							return (
								section.title !== 'Commands' &&
								section.title !==
									'For more info, run any command with the `--help` flag'
							)
						})
					if (answerFlags) {
						sections.push({
							title: 'Generator Options',
							body: answerFlags,
						})
					}
					sections.push({
						title: `Tips`,
						body: `  Prefix an option with '--no-' to set the value to 'false'.\n  e.g. --no-answers.unitTest`,
					})
					return sections
				}
				cli.outputHelp()
			} else {
				await grit.run()
			}
		} catch (error) {
			handleError(error)
		}
	}
