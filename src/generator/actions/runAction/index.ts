import { Grit } from '@/generator'
import { GeneratorConfig } from '@/generator/generatorConfig'
import { Action } from '@/index'
import { logger } from '@/logger'
import {
	addAction,
	modifyAction,
	moveAction,
	copyAction,
	removeAction,
} from '../action'

export const runAction = async (
	context: Grit,
	action: Action,
	config: GeneratorConfig
): Promise<void> => {
	logger.debug('Running action:', action)
	if (action.type === 'add' && action.files) {
		await addAction(context, action, config)
	} else if (action.type === 'modify' && action.handler) {
		await modifyAction(context, action, config)
	} else if (action.type === 'move' && action.patterns) {
		await moveAction(context, action, config)
	} else if (action.type === 'copy' && action.patterns) {
		await copyAction(context, action, config)
	} else if (action.type === 'remove' && action.files) {
		await removeAction(context, action, config)
	}
}

export type ActionFn<T> = (
	context: Grit,
	action: T,
	config?: GeneratorConfig
) => Promise<void>