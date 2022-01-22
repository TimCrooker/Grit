import { colors, logger } from 'swaglog'
import { spinner } from '@/utils/spinner'
import { NpmGenerator, parseGenerator, RepoGenerator, store } from 'gritenv'
import { checkGeneratorForUpdates } from '@/cli/routes/update/update'
import { home, HomeChoice } from '../home'
import { exit, ExitChoice } from '../exit'
import { promptConfirmAction } from '@/cli/prompts'
import { Terror } from '@/utils/error'
import { GeneratorChoiceValue, InquirerChoice } from '@/config'
import inquirer from 'inquirer'

type GeneratorUpdateList = Array<InquirerChoice<GeneratorChoiceValue<'update'>>>

export const generatorChoiceListUpdate =
	async (): Promise<GeneratorUpdateList> => {
		spinner.start('Loading your generators')
		const generatorChoices: GeneratorUpdateList = []

		for (const [name, generator] of store.generators.generatorNameList) {
			await checkGeneratorForUpdates(generator)
			logger.debug('Check for updates: ', colors.green(name))
			const updateInfo = generator.type === 'npm' ? generator.update : undefined
			if (updateInfo) {
				generatorChoices.push({
					name: `${name} ${colors.yellow('*Update Available*')} ${
						updateInfo.current
					} => ${updateInfo.latest}`,
					value: {
						method: 'update',
						generator,
					},
				})
			}
		}
		spinner.stop()
		return generatorChoices.sort(
			(a, b) => b.value.generator.runCount - a.value.generator.runCount
		)
	}

export type GeneratorUpdateOptions = {
	all?: boolean
}

/**
 * Run the generator that was directly called from the command line
 */
export const update = async (
	generatorName?: string,
	options: GeneratorUpdateOptions = {}
): Promise<void> => {
	// if no generator name specified, list all installed generators
	if (!generatorName) {
		const updatableGnerators = await generatorChoiceListUpdate()

		if (updatableGnerators.length === 0) {
			throw new Terror('No generators with updates found.')
		}

		if (options.all) {
			// loop over all generators in the store with availiable updates and update them
			for (const generator of updatableGnerators) {
				try {
					spinner.start(`Updating ${generator.name}`)
					await store.generators.update(generator.value.generator)
					spinner.succeed(generator.name)
				} catch (e) {
					spinner.fail(generator.name)
				}
			}
			spinner.stop()
			return
		}

		const choices = [
			...(await generatorChoiceListUpdate()),
			new inquirer.Separator(),
			HomeChoice,
			ExitChoice,
		]

		const { answer } = await inquirer.prompt({
			name: 'answer',
			type: 'list',
			message: `Select a generator to update`,
			choices,
			loop: false,
		})

		if (answer.method === 'update') {
			// ensure they mean to remove the generators
			const updateConfirmation = await promptConfirmAction(
				'update this generator'
			)

			if (updateConfirmation) {
				// update the selected generator in the store
				try {
					spinner.start('Updating generator')
					await store.generators.update(answer.generator)
					spinner.succeed('Update successful')
				} catch (e) {
					spinner.stop
					throw e
				}
			}

			// return to the update list
			await update()
			return
		}

		if (answer === 'home') await home()
		if (answer === 'exit') exit()
	}

	// if there is a generator name specified, make sure it exists in the store then update it
	if (typeof generatorName === 'string') {
		const generator = parseGenerator(generatorName) as
			| NpmGenerator
			| RepoGenerator

		logger.debug('attempting to update parsed generator:', generator)

		const generatorInstalled = store.generators.get(generator.hash)

		if (!generatorInstalled) {
			throw new Terror(
				`There is no generator named ${colors.cyan(
					generatorName
				)} installed on your machine`
			)
		}

		// ensure they mean to remove the generators
		const UpdateConfirmation = await promptConfirmAction(
			`update ${colors.cyan('grit-' + generatorName)}`
		)

		if (UpdateConfirmation) {
			// update the selected generator in the store
			try {
				spinner.start('Updating ' + colors.cyan('grit-' + generatorName))
				await store.generators.update(generator)
				spinner.succeed('Update successful')
			} catch (e) {
				spinner.stop
				throw e
			}
		}
	}
}

export const UpdateChoice = {
	name: 'Update Generators',
	value: 'update',
}
