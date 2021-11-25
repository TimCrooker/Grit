import { BackChoice } from '@/cli/BaseCLI/router'
import { GritError, handleError } from '@/error'
import { Grit } from '@/generator'
import { store } from '@/store'
import chalk from 'chalk'
import { ExitChoice, HelpChoice, HomeChoice } from '.'
import { GritRoute } from '../cli'
import { NpmSearch } from '../utils/npm'

/**
 *  This route lets the user search for generators using npm search.
 *
 *  eventuall make this searchable
 */
export const find: GritRoute = async (app, { options }) => {
	// get the generators from npm (packages that start with `grit-`)
	try {
		// Get a list of installed npm generators from the store
		const installedNpmGenerators = store.generators.npmGeneratorsNames

		// get the generators from npm)
		app.spinner.start('searching for grit-generators')
		const data = await NpmSearch({
			keywords: ['grit-generator'],
			resultCount: 50,
		})
		app.spinner.stop()

		// Create inquirer choices with search results
		const choices = [
			...data.map(({ package: { name, description } }) => {
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

		// verify output directory
		const { outputDir } = await app.prompt([
			{
				type: 'input',
				name: 'outputDir',
				message: `Where would you like to generate the files? ${app.chalk.gray(
					'leave blank to use current working directory'
				)}`,
				default: './',
			},
		])

		// Install and run the selected generator
		await new Grit({ generator: answer, ...options, outDir: outputDir }).run()

		// Go home after running the generator
		return await app.navigate('home')
	} catch (e) {
		if (e instanceof GritError || e instanceof Error) {
			handleError(e)
		}
	}
}

export const FindChoice = {
	name: 'Discover new generators',
	value: 'find',
}
