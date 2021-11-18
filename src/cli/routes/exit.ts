import Choice from 'inquirer/lib/objects/choice'
import { GritRoute } from '../cli'

export const exit: GritRoute = async (app, { args, options }) => {
	console.log('exit')
}

export const ExitChoice = {
	name: 'Exit',
	value: 'exit',
} as Choice
