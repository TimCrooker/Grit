import { GritRoute } from '../cli'

export const exit: GritRoute = async (app, { args, options }) => {
	console.log('exit')
}

export const ExitChoice = {
	name: 'Exit',
	value: 'exit',
}
