import { UserFirstName } from '@/config'
import { store } from '@/store'
import Choice from 'inquirer/lib/objects/choice'
import { ExitChoice, HelpChoice, FindChoice } from '.'
import { generatorChoiceList } from '../utils/generator'
import { getWelcomeMessage } from '../utils/welcome'
import { GritRoute } from '../cli'
import { getGenerator } from '../utils/getGenerator'

/**
 * This is the home route when users input just the `grit` keyword with no commands\
 */
export const home: GritRoute = async (app) => {
	// get the top 3 most used generators from store and present them as choices
	const RunGeneratorChoices = [
		new app.inquirer.Separator('Run Generator'),
		...(await generatorChoiceList()).slice(0, 100),
		new app.inquirer.Separator(),
	] as Choice[]

	const choices = [
		...RunGeneratorChoices,
		FindChoice,
		HelpChoice,
		ExitChoice,
	] as Choice[]

	// Show welcome message for new users
	getWelcomeMessage(store.generators.isEmpty)

	const { answer } = await app.prompt([
		{
			name: 'answer',
			type: 'list',
			message: `Hi ${app.chalk.underline(
				UserFirstName
			)}, What would you like to do?`,
			choices,
			loop: false,
		},
	])

	// If the user chose to run a generator and it has no updates, run it
	if (answer.method === 'run') {
		await (await getGenerator({ generator: answer.generator })).run()

		// Go home after generation
		return await app.navigate('home')
	}

	// Run when generators have an update available
	if (answer.method === 'update') {
		const { update } = await app.prompt([
			{
				name: 'update',
				type: 'confirm',
				message: `Do you want to update ${app.chalk.underline(
					answer.generator.name
				)}?`,
			},
		])

		const generator = await getGenerator({
			generator: answer.generator,
			update,
		})

		const { run } = await app.prompt([
			{
				name: 'run',
				type: 'confirm',
				message: `Do you want to run ${app.chalk.underline(
					answer.generator.name
				)}?`,
			},
		])

		if (run) {
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
