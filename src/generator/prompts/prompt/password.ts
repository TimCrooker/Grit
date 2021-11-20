import { BasePrompt, WithAnswers, WithFullContext, Answer } from '.'

export interface PasswordPrompt extends BasePrompt {
	type: 'password'
	mask: string
	mock?: string
	default?: WithAnswers<string>
	validate?: WithFullContext<string, boolean | string>
	filter?: WithFullContext<string, Answer>
}
