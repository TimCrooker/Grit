import Choice from 'inquirer/lib/objects/choice'
import { GritRoute } from '../cli'

export const list: GritRoute = async (app, { args, options }) => {
	const defaultChoices = [
		{
			name: 'Install a generator',
			value: 'install',
		},
		{
			name: 'Find some help',
			value: 'help',
		},
		{
			name: 'Get me out of here!',
			value: 'exit',
		},
	] as Choice[]

	// get genrator list

	// add update command if updates availiable

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `What would you like to do?`,
			choices: defaultChoices,
		},
	])

	if (answers.whatNext === 'exit') {
		await app.navigate('exit')
	}
}
