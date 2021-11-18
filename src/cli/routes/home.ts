import { UserFirstName } from '@/config'
import { Grit, GritOptions } from '@/generator'
import { store } from '@/store'
import chalk from 'chalk'
import inquirer from 'inquirer'
import Choice from 'inquirer/lib/objects/choice'
import { ExitChoice, HelpChoice } from '.'
import { GritRoute } from '../cli'
import { generatorChoiceList } from '../utils/generator'
import { getWelcomeMessage } from '../utils/welcome'
import { FindChoice } from './find'

/**
 * This is the home route when users input just the `grit` keyword with no commands\
 */
export const home: GritRoute = async (app) => {
	// get the top 3 most used generators from store and present them as choices
	const RunGeneratorChoices = [
		new inquirer.Separator('Run Generator'),
		...(await generatorChoiceList()).slice(0, 100),
	] as Choice[]

	const choices = [
		...RunGeneratorChoices,
		new inquirer.Separator(),
		FindChoice,
		HelpChoice,
		ExitChoice,
	] as Choice[]

	// Show welcome message for new users
	getWelcomeMessage(store.generators.isEmpty)

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `Hi ${chalk.underline(
				UserFirstName
			)}, What would you like to do?`,
			choices,
			loop: false,
		},
	])

	// If the user chose to run a generator and it has no updates, run it
	if (answers.whatNext.method === 'run') {
		await new Grit({ generator: answers.whatNext.generator }).run()

		// Go home after generation
		return await app.navigate('home')
	}

	// Run when generators have an update available
	if (answers.whatNext.method === 'update') {
		const updateGenerator = await app.prompt([
			{
				name: 'update',
				type: 'confirm',
				message: `Do you want to update ${chalk.underline(
					answers.whatNext.generator.name
				)}?`,
			},
		])

		const gritOptions: GritOptions = {
			generator: answers.whatNext.generator,
			update: updateGenerator.update,
		}

		await new Grit(gritOptions).run()

		// Go home after generation
		return await app.navigate('home')
	}

	// Route when generators are not selected
	return await app.navigate(answers.whatNext)
}

export const HomeChoice = {
	name: 'Go Home',
	value: 'home',
}
