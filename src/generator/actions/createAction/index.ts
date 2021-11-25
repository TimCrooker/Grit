import { Action } from '..'
import {
	AddAction,
	MoveAction,
	CopyAction,
	ModifyAction,
	RemoveAction,
} from '../action'

type RemoveActionType<T extends Action> = Omit<T, 'type'>

/** Simple type-safe creation of actions */
export class CreateAction {
	add(action: RemoveActionType<AddAction>): AddAction {
		return {
			...action,
			type: 'add',
		}
	}

	move(action: RemoveActionType<MoveAction>): MoveAction {
		return {
			...action,
			type: 'move',
		}
	}

	copy(action: RemoveActionType<CopyAction>): CopyAction {
		return {
			...action,
			type: 'copy',
		}
	}

	modify(action: RemoveActionType<ModifyAction>): ModifyAction {
		return {
			...action,
			type: 'modify',
		}
	}

	remove(action: RemoveActionType<RemoveAction>): RemoveAction {
		return {
			...action,
			type: 'remove',
		}
	}
}

export const createAction = new CreateAction()
