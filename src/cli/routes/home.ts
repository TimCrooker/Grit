import { GritRoute } from '../cli'

export const home: GritRoute = async (app, { args, options }) => {
	const defaultChoices = [
		{
			name: 'Run a generator',
			value: 'list',
		},
		{
			name: 'Install a generator',
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

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `What would you like to do?`,
			choices: defaultChoices,
		},
	])
	return await app.navigate(answers.whatnex.value)
}
