import { AddAction } from './add'
import { CopyAction } from './copy'
import { ModifyAction } from './modify'
import { MoveAction } from './move'
import { RemoveAction } from './remove'

export type Action =
	| AddAction
	| MoveAction
	| CopyAction
	| ModifyAction
	| RemoveAction
