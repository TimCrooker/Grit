import { answerStore, AnswerStore } from './answerStore'
import { GeneratorStore, generatorStore } from './generatorStore'

export class Store {
	generators: GeneratorStore = generatorStore
	answers: AnswerStore = answerStore
}

export const store = new Store()
