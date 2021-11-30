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

export type ActionProvider = (context: Grit) => Promise<Action[]> | Action[]

export type Action =
	| AddAction
	| MoveAction
	| CopyAction
	| ModifyAction
	| RemoveAction

export class Actions {
	private actions: Action[] = []
	private context: Grit
	private actionProviders: ActionProvider[] = []

	constructor(context: Grit) {
		this.context = context
	}

	async run(grit = this.context): Promise<void> {
		await this.getActions()

		for (const action of this.actions) {
			await runAction(grit, action)
		}
	}

	private async getActions(
		context: Grit = this.context,
		config: GeneratorConfig['actions'] = this.context.config.actions
	): Promise<void> {
		const actionsArray =
			typeof config === 'function' ? await config.call(this, context) : config
		if (actionsArray && actionsArray.length > 0)
			this.actions = [...this.actions, ...actionsArray]

		for (const actionProvider of this.actionProviders) {
			const actions = await actionProvider(context)
			this.actions.push(...actions)
		}
	}

	/**
	 * Register Action providing functions to be executed in the actions section of the generator
	 *
	 * this allows you to hook into the actions section of a generator to add new functionality
	 */
	registerActionProvider(actionProvider: ActionProvider): void {
		this.actionProviders.push(actionProvider)
	}

	/**
	 * Runtime availiable methods
	 */

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

	// pluginActions(): this {
	// 	this.newAction(this.grit.plugins.)
	// 	return this
	// }
}
