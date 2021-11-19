import { Answer, Answers } from './answers'
import { CheckboxChoice, ListChoice } from './choice'

export type PromptType =
	| ListPrompt
	| ConfirmPrompt
	| NumberPrompt
	| PasswordPrompt
	| CheckboxPrompt
	| InputPrompt

type WithAnswers<T> = T | ((answers: Answers) => T)

type WithFullContext<T, Y> = (input: T, answers: Answers) => Y

export interface BasePrompt {
	type: string
	name: string
	message: WithAnswers<string>
	when?: WithAnswers<boolean>
	prefix?: string
	suffix?: string
	/** Store the answer in cache for next time */
	store?: boolean
}

export interface InputPrompt extends BasePrompt {
	type: 'input'
	mock?: string
	default?: WithAnswers<string>
	validate?: WithFullContext<string, boolean | string>
	filter?: WithFullContext<string, Answer>
}

export interface PasswordPrompt extends BasePrompt {
	type: 'password'
	mask: string
	mock?: string
	default?: WithAnswers<string>
	validate?: WithFullContext<string, boolean | string>
	filter?: WithFullContext<string, Answer>
}

export interface NumberPrompt extends BasePrompt {
	type: 'number'
	mock: number
	default?: WithAnswers<number>
	validate?: WithFullContext<number, boolean | string>
	filter?: WithFullContext<number, Answer>
}

export interface ConfirmPrompt extends BasePrompt {
	type: 'confirm'
	mock: boolean
	default?: WithAnswers<boolean>
}

export type ArrayPrompt = ListPrompt | CheckboxPrompt

export interface CheckboxPrompt extends BasePrompt {
	type: 'checkbox'
	mock: Array<string>
	choices: WithAnswers<CheckboxChoice[]>
	default?: WithAnswers<string[]>
	validate?: WithFullContext<string, boolean | string>
	filter?: WithFullContext<unknown, Array<string>>
}

export interface ListPrompt extends BasePrompt {
	type: 'list' | 'rawlist'
	mock: string
	choices: WithAnswers<ListChoice[]>
	/** Must be the index or value of desired choice */
	default?: WithAnswers<number | string>
	filter?: WithFullContext<unknown, string>
	loop?: boolean
}
