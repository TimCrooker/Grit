import { BasePrompt, WithAnswers, WithFullContext, Answer } from '..'

export interface InputPrompt extends BasePrompt {
	type: 'input'
	mock?: string
	default?: WithAnswers<string>
	validate?: WithFullContext<string, boolean | string>
	filter?: WithFullContext<string, string>
}
