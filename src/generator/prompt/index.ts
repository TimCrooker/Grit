import { GritError } from '@/error'
import { logger } from '@/logger'
import inquirer from 'inquirer'
import { Answers } from './answers'
import { ArrayPrompt, PromptType } from './prompt'

/** Throw errors when prompts are incorrectly formatted */
function validatePrompt(prompt: PromptType, index: number): void {
	if (!prompt.type) {
		throw new GritError(`Missing property "type" on prompt # ${index + 1})`)
	}

	if (!prompt.message) {
		throw new GritError(
			`Missing property "message" on prompt (index: ${index})`
		)
	}

	if (!prompt.name) {
		throw new GritError(`Missing property "name" on prompt (index: ${index})`)
	}
}

interface PromptOptions {
	prompts: PromptType[]
	cachedAnswers?: Answers
	injectedAnswers?: Answers
	mock?: boolean
}

/** Use inquirer to get answers to the prompts from the user */
export const prompt = async ({
	prompts,
	cachedAnswers,
	injectedAnswers = {},
	mock,
}: PromptOptions): Promise<Answers> => {
	if (typeof injectedAnswers === 'string') {
		injectedAnswers = JSON.parse(injectedAnswers)
	}

	logger.debug('Generator injected answers:', injectedAnswers)

	const parsedPrompts: PromptType[] = prompts.map(
		(prompt: PromptType, index) => {
			validatePrompt(prompt, index)

			// Push mock values to the injected answers
			if (mock) {
				let injectMock
				if (prompt.mock) injectMock = prompt.mock
				else if (typeof prompt.default !== 'function') {
					injectMock = prompt.default
				}
				injectedAnswers[prompt.name] = injectMock
			}

			return {
				...prompt,
				type: prompt.type,
				name: prompt.name,
				message: prompt.message,
				when(answers) {
					if (mock) return false
					if (typeof prompt.when === 'function') {
						return prompt.when(answers)
					}
					return true
				},
				default(answers) {
					// If we have cached answers, use them to override the defaults before we prompt the username
					if (cachedAnswers && cachedAnswers[prompt.name]) {
						return cachedAnswers[prompt.name]
					}
					if (typeof prompt.default === 'function') {
						return prompt.default(answers)
					}
					return prompt.default
				},
				choices(answers: Answers) {
					const choices = (prompt as ArrayPrompt).choices
					if (typeof choices === 'function') {
						return choices(answers)
					}
					return choices
				},
			} as PromptType
		}
	)

	// if there are injected answers, then automatically answer the prompts included with the injected answers
	const answers = await inquirer.prompt(parsedPrompts, injectedAnswers)

	return answers
}
