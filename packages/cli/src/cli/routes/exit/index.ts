import { GritRoute } from '@/cli/config'
import Choice from 'inquirer/lib/objects/choice'

export const exit: GritRoute = async (app, { args, options }) => {
	app.logger.log('See ya next time there bud')
	return
}

export const ExitChoice = {
	name: 'Exit',
	value: 'exit',
} as Choice
