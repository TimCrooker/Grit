import { GritRoute } from '../cli'

export const install: GritRoute = async (app, { args, options }) => {
	const defaultChoices = [
		{
			name: 'taco',
			value: 'taco',
		},
	]

	const answers = await app.prompt([
		{
			name: 'whatNext',
			type: 'list',
			message: `What would you like to do?`,
			choices: [...defaultChoices, { name: 'Go home', value: 'home' }],
		},
	])

	return await app.navigate(answers.whatNext)
}
