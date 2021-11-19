import { UserFirstName } from '@/config'
import { Grit, GritOptions } from '@/generator'
import { store } from '@/store'
import chalk from 'chalk'
import inquirer from 'inquirer'
import Choice from 'inquirer/lib/objects/choice'
import { ExitChoice, HelpChoice, FindChoice } from '.'
import { GritRoute } from '../cli'
import { generatorChoiceList } from '../utils/generator'
import { getWelcomeMessage } from '../utils/welcome'

/**
 * This is the home route when users input just the `grit` keyword with no commands\
 */
export const home: GritRoute = async (app) => {
	// get the top 3 most used generators from store and present them as choices
	const RunGeneratorChoices = [
		new inquirer.Separator('Run Generator'),
		...(await generatorChoiceList()).slice(0, 100),
		new inquirer.Separator(),
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
			message: `Hi ${chalk.underline(
				UserFirstName
			)}, What would you like to do?`,
			choices,
			loop: false,
		},
	])

	// If the user chose to run a generator and it has no updates, run it
	if (answer.method === 'run') {
		await new Grit({ generator: answer.generator }).run()

		// Go home after generation
		return await app.navigate('home')
	}

	// Run when generators have an update available
	if (answer.method === 'update') {
		const updateGenerator = await app.prompt([
			{
				name: 'update',
				type: 'confirm',
				message: `Do you want to update ${chalk.underline(
					answer.generator.name
				)}?`,
			},
		])

		const gritOptions: GritOptions = {
			generator: answer.generator,
			update: updateGenerator.update,
		}

		await new Grit(gritOptions).run()

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
