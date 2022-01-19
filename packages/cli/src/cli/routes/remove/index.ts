import { colors } from 'swaglog'
import { GritRoute } from '@/cli/config'
import { promptConfirmAction } from '@/cli/prompts'
import { GeneratorChoiceValue, InquirerChoice } from '@/utils/generator'
import { spinner } from '@/utils/spinner'
import { parseGenerator, store } from 'gritenv'
import { ExitChoice, HomeChoice } from '..'

type GeneratorRemoveList = Array<InquirerChoice<GeneratorChoiceValue<'remove'>>>

export const generatorChoiceListRemove = (): GeneratorRemoveList => {
	spinner.start('Loading your generators')
	const generatorChoices: GeneratorRemoveList = []

	for (const [name, generator] of store.generators.generatorNameList) {
		generatorChoices.push({
			name: `${name} ${colors.yellow(generator.version)}`,
			value: {
				method: 'remove',
				generator,
			},
		})
	}
	spinner.stop()
	return generatorChoices.sort(
		(a, b) => a.value.generator.runCount - b.value.generator.runCount
	)
}

/**
 * Remove installed generators
 */
export const remove: GritRoute = async (app, { args, options }) => {
	const generatorName = args[1]

	// if no generator name specified, list all installed generators
	if (!generatorName) {
		const generatorChoices = generatorChoiceListRemove()

		const choices = [
			...generatorChoices,
			new app.inquirer.Separator(
				generatorChoices.length > 0 ? '' : 'No generators installed'
			),
			HomeChoice,
			ExitChoice,
		]

		const { answer } = await app.prompt({
			name: 'answer',
			type: 'list',
			message: `Select a generator to remove`,
			choices,
			loop: false,
		})

		if (answer.method === 'remove') {
			// ensure they mean to remove the generators
			const removeConfirmation = await promptConfirmAction(
				'remove this generator'
			)

			if (removeConfirmation) {
				// remove the selected generator from the store
				try {
					spinner.start(`Removing ${answer.generator.name}`)
					store.generators.remove(answer.generator)
					spinner.succeed('Removal successful')
				} catch (e) {
					spinner.stop()
					throw e
				}
			}

			return await app.navigate('remove')
		}

		return await app.navigate(answer)
	}

	// if there is a generator name specified, make sure it exists in the store then remove it
	if (generatorName) {
		const generator = parseGenerator(generatorName)

		const generatorInstalled = store.generators.get(generator.hash)

		if (!generatorInstalled) {
			throw new app.error(
				`There is no generator named ${app.colors.cyan(
					'grit-' + generatorName
				)} installed on your machine`
			)
		}

		// ensure they mean to remove the generators
		const removeConfirmation = await promptConfirmAction(
			'remove ' +
				app.colors.cyan('grit-' + generatorName) +
				' from your machine'
		)

		if (removeConfirmation) {
			// remove the selected generator from the store
			try {
				spinner.start('Removing ' + app.colors.cyan('grit-' + generatorName))
				store.generators.remove(generator)
				spinner.succeed('Removed ' + app.colors.cyan('grit-' + generatorName))
			} catch (e) {
				spinner.stop()
				throw e
			}
		}
	}
}

export const RemoveChoice = {
	name: 'Delete Generators',
	value: 'remove',
}
