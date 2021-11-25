import { GeneratorConfig, Grit } from '@/index'
import {
	AddAction,
	CopyAction,
	ModifyAction,
	MoveAction,
	RemoveAction,
} from './action'
import { createAction } from './createAction'
import { runAction } from './runAction'

export type Action =
	| AddAction
	| MoveAction
	| CopyAction
	| ModifyAction
	| RemoveAction

export class Actions {
	actions: Action[] = []
	create = createAction

	async getActions(
		context: Grit,
		config: GeneratorConfig['actions']
	): Promise<void> {
		const actionsArray =
			typeof config === 'function'
				? await config.call(context, context)
				: config
		if (!actionsArray || actionsArray.length === 0) return

		this.actions = [...this.actions, ...actionsArray]
	}

	async run(context: Grit, config: GeneratorConfig): Promise<void> {
		await this.getActions(context, config.actions)

		for (const action of this.actions) {
			await runAction(context, action, config)
		}
	}

	/** Add a action or an array of actions to the generator */
	add(action: Action | Action[]): void {
		const validateAndPush = (prompt: Action): void => {
			this.actions.push(prompt)
		}

		if (Array.isArray(action)) {
			action.forEach((prompt) => {
				validateAndPush(prompt)
			})
		} else {
			validateAndPush(action)
		}
	}
}
