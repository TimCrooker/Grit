import { escapeDots } from '../utils/glob'
import { cac } from 'cac'
import { store } from '../store'

export const getAlias =
	(cli: ReturnType<typeof cac>) =>
	async (name: string): Promise<void> => {
		if (cli.options.help) {
			cli.outputHelp()
			return
		}
		console.log(store.get(`alias.${escapeDots(name)}`))
	}
