import Choice from 'inquirer/lib/objects/choice'
import { GritRoute } from '..'

export const exit: GritRoute = async (app, { args, options }) => {
	console.log('See ya next time there bud')
}

export const ExitChoice = {
	name: 'Exit',
	value: 'exit',
} as Choice
