import { Answers } from 'inquirer'
import { BaseStore, BaseStoreOptions } from '../baseStore'

type AnswerStoreOptions = BaseStoreOptions

export class AnswerStore extends BaseStore<Answers> {
	constructor(options?: AnswerStoreOptions) {
		super({ ...options })
	}
}

export const answerStore = new AnswerStore({ storeFileName: 'answers.json' })
