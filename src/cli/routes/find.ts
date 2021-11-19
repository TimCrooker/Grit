import { BackChoice } from '@/CLI_FRAMEWORK/router'
import { handleError } from '@/error'
import { Grit } from '@/generator/index'
import { store } from '@/store'
import axios from 'axios'
import chalk from 'chalk'
import { ExitChoice, HelpChoice, HomeChoice } from '.'
import { GritRoute } from '../cli'

/**
 *  This route lets the user search for generators using npm search.
 *
 *  eventuall make this searchable
 */
export const find: GritRoute = async (app, { args, options }) => {
	// get the generators from npm (packages that start with `grit-`)
	try {
		// Get a list of installed npm generators from the store
		const installedNpmGenerators = store.generators.npmGeneratorsNames

		// get the generators from npm)
		app.spinner.start('searching for grit-generators')
		const { data } = await axios.get(
			'http://registry.npmjs.com/-/v1/search?text=keywords:grit-generator&size=20'
		)
		app.spinner.stop()

		// Create inquirer choices with search results
		const choices = [
			...data.objects.map(({ package: { name, description } }) => {
				name = name.replace('grit-', '')
				const alreadyInstalled = installedNpmGenerators.includes(name)

				return {
					name: `${name} ${chalk.gray(description)}${
						alreadyInstalled ? chalk.yellow(' installed') : ''
					} `,
					value: name,
				}
			}),
			new app.inquirer.Separator(),
			{ name: 'Refresh list', value: 'find' },
			BackChoice,
			HomeChoice,
			HelpChoice,
			ExitChoice,
		]

		const { answer } = await app.prompt([
			{
				type: 'list',
				name: 'answer',
				message: 'Which generator would you like to use?',
				choices,
				loop: false,
			},
		])

		if (
			answer === 'find' ||
			answer === 'back' ||
			answer === 'home' ||
			answer === 'help' ||
			answer === 'exit'
		) {
			return await app.navigate(answer)
		}

		// Install and run the selected generator
		await new Grit({ generator: answer, ...options }).run()

		// Go home after running the generator
		return await app.navigate('home')
	} catch (error) {
		handleError(error)
	}
}

export const FindChoice = {
	name: 'Discover new generators',
	value: 'find',
}
