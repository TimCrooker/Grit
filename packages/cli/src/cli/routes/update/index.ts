import { colors, logger } from 'swaglog'
import { GritRoute } from '@/cli/config'
import { spinner } from '@/utils/spinner'
import { GeneratorChoiceValue, InquirerChoice } from '@/utils/generator'
import { NpmGenerator, parseGenerator, RepoGenerator, store } from 'gritenv'
import { checkGeneratorForUpdates } from '@/utils/update'
import { HomeChoice } from '../home'
import { ExitChoice } from '../exit'
import { promptConfirmAction } from '@/cli/prompts'

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

/**
 * Run the generator that was directly called from the command line
 */
export const update: GritRoute = async (app, { args, options }) => {
	const generatorName = args[1]

	// if no generator name specified, list all installed generators
	if (!generatorName) {
		const updatableGnerators = await generatorChoiceListUpdate()

		if (updatableGnerators.length === 0) {
			throw new app.error('No generators with updates found.')
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
		}

		const choices = [
			...(await generatorChoiceListUpdate()),
			new app.inquirer.Separator(),
			HomeChoice,
			ExitChoice,
		]

		const { answer } = await app.prompt({
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

			return await app.navigate('update')
		}

		return await app.navigate(answer)
	}

	// if there is a generator name specified, make sure it exists in the store then update it
	if (typeof generatorName === 'string') {
		const generator = parseGenerator(generatorName) as
			| NpmGenerator
			| RepoGenerator

		app.logger.debug('attempting to update parsed generator:', generator)

		const generatorInstalled = store.generators.get(generator.hash)

		if (!generatorInstalled) {
			throw new app.error(
				`There is no generator named ${app.colors.cyan(
					generatorName
				)} installed on your machine`
			)
		}

		// ensure they mean to remove the generators
		const UpdateConfirmation = await promptConfirmAction(
			`update ${app.colors.cyan('grit-' + generatorName)}`
		)

		if (UpdateConfirmation) {
			// update the selected generator in the store
			try {
				spinner.start('Updating ' + app.colors.cyan('grit-' + generatorName))
				await store.generators.update(generator)
				spinner.succeed('Update successful')
			} catch (e) {
				spinner.stop
				throw e
			}
		}
	}
}
