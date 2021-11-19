import { GeneratorConfig } from '../generatorConfig'
import { logger } from '@/logger'
import { Grit } from '../..'
import { addAction } from './add'
import { modifyAction } from './modify'
import { removeAction } from './remove'
import { copyAction } from './copy'
import { moveAction } from './move'

const runAction = async (
	context: Grit,
	actions: any[],
	config: GeneratorConfig
): Promise<void> => {
	for (const action of actions) {
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
}

export type ActionFn<T> = (
	context: Grit,
	action: T,
	config: GeneratorConfig
) => Promise<void>

export const runActions = async (
	context: Grit,
	config: GeneratorConfig
): Promise<void> => {
	const actions =
		typeof config.actions === 'function'
			? await config.actions.call(context, context)
			: config.actions
	if (!actions) return

	await runAction(context, actions, config)
}
