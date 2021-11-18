import { handleError } from '@/error'
import { Grit } from '@/generator'
import { spinner } from '@/spinner'
import { store } from '@/store'
import axios from 'axios'
import chalk from 'chalk'
import { GritRoute } from '../cli'

/**
 *  This route lets the user search for generators using npm search.
 */
export const find: GritRoute = async (app, { args, options }) => {
	// get the generators from npm (packages that start with `grit-`)
	try {
		// Get a list of installed npm generators
		const installedNpmGenerators = store.generators.npmGeneratorsNames

		// get the generators from npm)
		spinner.start('searching for grit-generators')
		const { data } = await axios.get(
			'http://registry.npmjs.com/-/v1/search?text=keywords:grit-generator&size=20'
		)
		spinner.stop()

		// Create inquirer choices with search results
		const choices = data.objects.map(({ package: { name, description } }) => {
			name = name.replace('grit-', '')
			const alreadyInstalled = installedNpmGenerators.includes(name)

			return {
				name: `${name} ${chalk.gray(description)}${
					alreadyInstalled ? chalk.yellow(' installed') : ''
				} `,
				value: name,
			}
		})

		const { generator } = await app.prompt([
			{
				type: 'list',
				name: 'generator',
				message: 'Which generator would you like to use?',
				choices,
			},
		])

		// run the generator
		await new Grit({ generator, ...options }).run()
	} catch (e) {
		handleError(e)
	}
	// after the user has chosen the generator prompt them to install it for later or install & run it
}

export const FindChoice = {
	name: 'Search for new generators',
	value: 'find',
}
