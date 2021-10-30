import { store } from '../store'
import { escapeDots } from '../utils/glob'
import { logger } from '../utils/logger'

export const setAlias =
	() =>
	async (name: string, value: string): Promise<void> => {
		store.set(`alias.${escapeDots(name)}`, value)
		logger.success(`Added alias '${name}'`)
	}
