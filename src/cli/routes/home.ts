import inquirer from 'inquirer'
import { GritRoute } from '../cli'

export const home: GritRoute = async (app, { args, options }) => {
	const defaultChoices = [
		{
			name: 'Install a NEW generator',
			value: 'install',
		},
		{
			name: 'Get Help',
			value: 'help',
		},
		{
			name: 'Exit',
			value: 'exit',
		},
	]

	// get genrator list
	const generatorList = (): {
		name: string
		value: { method: string; generator: string }
	}[] => {
		return [{ name: 'test', value: { method: 'test', generator: 'test' } }]
	}

	// add update command if updates availiable

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `What would you like to do?`,
			choices: [
				new inquirer.Separator('Run a generator'),
				...generatorList(),
				new inquirer.Separator(),
				...defaultChoices,
				new inquirer.Separator(),
			],
		},
	])
	return await app.navigate(answers.whatNext)
}
