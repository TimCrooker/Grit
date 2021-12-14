import { GritRoute } from '@/cli/config'
import { promptGeneratorRun, promptOutDir } from '@/cli/prompts'
import { NpmSearch } from '@/utils/npm'
import { BackChoice } from 'clifi'
import { getGenerator, store } from 'gritenv'
import { HomeChoice, HelpChoice, ExitChoice } from '..'

/**
 *  This route lets the user search for generators using npm search.
 *
 *  eventuall make this searchable
 */
export const find: GritRoute = async (app, { options }) => {
	// Get a list of installed npm generators from the store
	const installedNpmGenerators = store.generators.npmGeneratorsNames

	// get the generators from npm (packages that start with `grit-` and have the `grit-generator` keyword)
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
				name: `${name} ${app.colors.gray(description)}${
					alreadyInstalled ? app.colors.yellow(' installed') : ''
				} `,
				value: { generator: name, installed: alreadyInstalled },
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
			message: 'Install and run a generator',
			choices,
			loop: true,
		},
	])

	// User selected a generator
	if (answer.generator) {
		const generator = answer.generator as string
		const alreadyInstalled = answer.installed as boolean

		// if the generator is already installed then run it
		if (alreadyInstalled) {
			const outDir = await promptOutDir()
			await (await getGenerator({ generator, outDir })).run()
			return await app.navigate('home')
		}

		// ask user if they want to run the generator after installation
		const run = await promptGeneratorRun()

		// install and run the generator
		if (run === true) {
			const outDir = await promptOutDir()

			// Get the chosen generator
			await (
				await getGenerator({
					generator: answer,
					...options,
					outDir,
				})
			).run()

			// Go home after running the generator
			return await app.navigate('home')
		} else {
			// only install the generator
			store.generators.add(answer)

			// Go home after installing the generator
		}
	}

	// if the answer is a route navigate to it
	return await app.navigate(answer)
}

export const FindChoice = {
	name: 'Discover new generators',
	value: 'find',
}
