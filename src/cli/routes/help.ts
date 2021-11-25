import { DOCS_URL, GITHUB_URL } from '@/config'
import Choice from 'inquirer/lib/objects/choice'
import { GritRoute } from '..'
import open from 'open'
import { ExitChoice, HomeChoice } from '.'
import { BackChoice } from '@/cli/BaseCLI/router'

export const help: GritRoute = async (app, { args, options }) => {
	const choices = [
		{
			name: 'Read the documentation (open in browser)',
			value: 'docs',
		},
		{
			name: 'View the source code',
			value: 'source',
		},
		new app.inquirer.Separator(),
		HomeChoice,
		BackChoice,
		ExitChoice,
	] as Choice[]

	const { answer } = await app.prompt([
		{
			type: 'list',
			name: 'answer',
			message: 'What do you need help with?',
			choices,
		},
	])

	switch (answer) {
		// Open docs in browser
		case 'docs':
			await open(DOCS_URL)
			break
		case 'source':
			await open(GITHUB_URL)
			break
		default:
			return await app.navigate(answer)
			break
	}

	return await app.navigate('home')
}

export const HelpChoice = {
	name: 'Get Some Help',
	value: 'help',
} as Choice
