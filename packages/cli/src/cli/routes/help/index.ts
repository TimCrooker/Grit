import { DOCS_URL, GITHUB_URL } from '@/config'
import inquirer from 'inquirer'
import Choice from 'inquirer/lib/objects/choice'
import open from 'open'
import { exit, ExitChoice, home, HomeChoice } from '..'

export const help = async (): Promise<void> => {
	const choices = [
		{
			name: 'Read the documentation (open in browser)',
			value: 'docs',
		},
		{
			name: 'View the source code',
			value: 'source',
		},
		new inquirer.Separator(),
		HomeChoice,
		ExitChoice,
	] as Choice[]

	const { answer } = await inquirer.prompt([
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
		case 'home':
			await home()
			break
		case 'exit':
			exit()
			break
	}
}

export const HelpChoice = {
	name: 'Get Some Help',
	value: 'help',
} as Choice
