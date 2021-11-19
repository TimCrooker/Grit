import { Action } from '.'
import { AddAction } from './add'
import { CopyAction } from './copy'
import { ModifyAction } from './modify'
import { MoveAction } from './move'

type RemoveActionType<T extends Action> = Omit<T, 'type'>

/** Allows safe and easy creation of actions */
export class CreateAction {
	static add(action: RemoveActionType<AddAction>): AddAction {
		return {
			...action,
			type: 'add',
		}
	}

	static move(action: RemoveActionType<MoveAction>): MoveAction {
		return {
			...action,
			type: 'move',
		}
	}

	static copy(action: RemoveActionType<CopyAction>): CopyAction {
		return {
			...action,
			type: 'copy',
		}
	}

	static modify(action: RemoveActionType<ModifyAction>): ModifyAction {
		return {
			...action,
			type: 'modify',
		}
	}

	static remove(action: RemoveActionType<AddAction>): AddAction {
		return {
			...action,
			type: 'add',
		}
	}
}

