import { BasePrompt, WithAnswers } from '.'

export interface ConfirmPrompt extends BasePrompt {
	type: 'confirm'
	mock?: boolean
	default?: WithAnswers<boolean>
}
