import { GeneratorConfig, Grit } from '@/index'
import {
	AddAction,
	CopyAction,
	ModifyAction,
	MoveAction,
	RemoveAction,
} from './action'
import { createAction, RemoveActionType } from './createAction'
import { runAction } from './runAction'

export type Action =
	| AddAction
	| MoveAction
	| CopyAction
	| ModifyAction
	| RemoveAction

export class Actions {
	private actions: Action[] = []
	private grit: Grit

	constructor(context: Grit) {
		this.grit = context
	}

	async run(grit = this.grit): Promise<void> {
		await this.getActions()

		for (const action of this.actions) {
			await runAction(grit, action)
		}
	}

	private async getActions(
		context: Grit = this.grit,
		config: GeneratorConfig['actions'] = this.grit.config.actions
	): Promise<void> {
		const actionsArray =
			typeof config === 'function' ? await config.call(this, context) : config
		if (!actionsArray || actionsArray.length === 0) return

		this.actions = [...this.actions, ...actionsArray]
	}

	/** Add a action or an array of actions to the generator */
	newAction(action: Action | Action[]): void {
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

	add(action: RemoveActionType<AddAction>): this {
		this.newAction(createAction.add(action))
		return this
	}

	move(action: RemoveActionType<MoveAction>): this {
		this.newAction(createAction.move(action))
		return this
	}

	copy(action: RemoveActionType<CopyAction>): this {
		this.newAction(createAction.copy(action))
		return this
	}

	modify(action: RemoveActionType<ModifyAction>): this {
		this.newAction(createAction.modify(action))
		return this
	}

	remove(action: RemoveActionType<RemoveAction>): this {
		this.newAction(createAction.remove(action))
		return this
	}
}
