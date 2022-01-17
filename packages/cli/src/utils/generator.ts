import { StoreGenerator } from 'gritenv'

export interface GeneratorChoiceValue<T = string> {
	method: T
	generator: StoreGenerator
}

export interface InquirerChoice<T = any> {
	name: string
	value: T
}
