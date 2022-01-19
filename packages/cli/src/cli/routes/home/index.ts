import { colors, logger } from 'swaglog'
import { GritRoute } from '@/cli/config'
import {
	promptGeneratorRun,
	promptGeneratorUpdate,
	promptOutDir,
} from '@/cli/prompts'
import { UserFirstName } from '@/config'
import { GeneratorChoiceValue, InquirerChoice } from '@/utils/generator'
import { spinner } from '@/utils/spinner'
import { checkGeneratorForUpdates } from '@/utils/update'
import { getWelcomeMessage } from '@/utils/welcome'
import { getGenerator, store } from 'gritenv'
import Choice from 'inquirer/lib/objects/choice'
import {
	FindChoice,
	HelpChoice,
	ExitChoice,
	UpdateChoice,
	RemoveChoice,
} from '..'

type GeneratorUpdateRunList = InquirerChoice<
	GeneratorChoiceValue<'update' | 'run'>
>[]

export const generatorChoiceListUpdateRun = (): GeneratorUpdateRunList => {
	spinner.start('Loading your generators')
	const generatorChoices: GeneratorUpdateRunList = []

	for (const [name, generator] of store.generators.generatorNameList) {
		checkGeneratorForUpdates(generator)
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
		} else {
			generatorChoices.push({
				name: `${name} ${colors.yellow(generator.version)}`,
				value: { method: 'run', generator },
			})
		}
	}
	spinner.stop()
	return generatorChoices.sort(
		(a, b) => b.value.generator.runCount - a.value.generator.runCount
	)
}

/**
 * This is the home route when users input just the `grit` keyword with no commands
 */
export const home: GritRoute = async (app) => {
	// get the generators from store and present them as choices sorted my most used
	const generatorList = (await generatorChoiceListUpdateRun()).slice(0, 100)
	const RunGeneratorChoices =
		generatorList.length > 0
			? ([
					new app.inquirer.Separator('Run Generator'),
					...generatorList,
					new app.inquirer.Separator(),
			  ] as Choice[])
			: []

	const choices = [
		...RunGeneratorChoices,
		FindChoice,
		RemoveChoice,
		HelpChoice,
		ExitChoice,
	] as Choice[]

	// Show welcome message
	getWelcomeMessage(true)

	const { answer } = await app.prompt({
		name: 'answer',
		type: 'list',
		message: `Hi ${app.colors.underline(
			UserFirstName
		)}, What would you like to do?`,
		choices,
		loop: false,
	})

	// If the user chose to run a generator and it has no updates, run it
	if (answer.method === 'run') {
		const outDir = await promptOutDir()

		await (await getGenerator({ generator: answer.generator, outDir })).run()

		// Go home after generation
		return await app.navigate('home')
	}

	// Run when generators have an update available
	if (answer.method === 'update') {
		const update = await promptGeneratorUpdate()
		if (update) {
			await store.generators.update(answer.generator)
		}

		const run = await promptGeneratorRun()
		if (run) {
			const generator = await getGenerator({
				generator: answer.generator,
			})
			await generator.run()
		}

		// Go home after generation
		return await app.navigate('home')
	}

	// Route when generators are not selected
	return await app.navigate(answer)
}

/** Choice for navigating home */
export const HomeChoice = {
	name: 'Go Home',
	value: 'home',
}
