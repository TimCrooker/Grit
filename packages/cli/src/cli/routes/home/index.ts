import { GritRoute } from '@/cli/config'
import {
	promptGeneratorRun,
	promptGeneratorUpdate,
	promptOutDir,
} from '@/cli/prompts'
import { UserFirstName } from '@/config'
import { Terror } from '@/utils/error'
import { generatorChoiceList } from '@/utils/generator'
import { getWelcomeMessage } from '@/utils/welcome'
import { getGenerator } from 'gritenv'
import Choice from 'inquirer/lib/objects/choice'
import { FindChoice, HelpChoice, ExitChoice } from '..'

/**
 * This is the home route when users input just the `grit` keyword with no commands
 */
export const home: GritRoute = async (app) => {
	// get the generators from store and present them as choices sorted my most used
	const generatorList = (await generatorChoiceList()).slice(0, 100)
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
		try {
			const outDir = await promptOutDir()

			await (await getGenerator({ generator: answer.generator, outDir })).run()

			// Go home after generation
			return await app.navigate('home')
		} catch (error) {
			throw new Terror('Issue when running generator from the list: \n' + error)
		}
	}

	// Run when generators have an update available
	if (answer.method === 'update') {
		try {
			const update = await promptGeneratorUpdate()
			const generator = await getGenerator({
				generator: answer.generator,
				update,
			})

			const run = await promptGeneratorRun()
			if (run) {
				await generator.run()
			}

			// Go home after generation
			return await app.navigate('home')
		} catch (error) {
			throw new Terror("Couldn't update generator: \n" + error)
		}
	}

	// Route when generators are not selected
	return await app.navigate(answer)
}

/** Choice for navigating home */
export const HomeChoice = {
	name: 'Go Home',
	value: 'home',
}
