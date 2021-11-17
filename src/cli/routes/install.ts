import { GritRoute } from '..'

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

export const InstallChoice = {
	name: 'Install a new Generator',
	value: 'install',
}
