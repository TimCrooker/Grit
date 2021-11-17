import Choice from 'inquirer/lib/objects/choice'
import { GritRoute } from '..'

export const help: GritRoute = (app, { args, options }) => {}

export const HelpChoice = {
	name: 'Get Some Help',
	value: 'help',
} as Choice
