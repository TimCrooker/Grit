import { GritError } from '@/error'
import { logger } from '@/logger'
import inquirer from 'inquirer'
import { ConfirmPrompt } from './confirm'
import { InputPrompt } from './input'
import { NumberPrompt } from './number'
import { PasswordPrompt } from './password'
import { CheckboxPrompt } from './withChoices/checkbox'
import { ListPrompt } from './withChoices/list'

export type Answers = Record<string, any> & { plugins?: string[] }

export type Answer<T = any> = Record<string, T>

export type WithAnswers<T> = T | ((answers: Answers) => T)

export type WithFullContext<T, Y> = (input: T, answers: Answers) => Y

export type Prompt =
	| ListPrompt
	| ConfirmPrompt
	| NumberPrompt
	| PasswordPrompt
	| CheckboxPrompt
	| InputPrompt

export interface BasePrompt {
	type: string
	name: string
	message: WithAnswers<string>
	/** Skips the question when false is returned */
	when?: WithAnswers<boolean>
	prefix?: string
	suffix?: string
	/** Store the answer in cache for next time */
	store?: boolean
}

export type ArrayPrompt = ListPrompt | CheckboxPrompt

/** Throw errors when prompts are incorrectly formatted */
function validatePrompt(prompt: Prompt, index: number): void {
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
	prompts: Prompt[]
	cachedAnswers?: Answers
	injectedAnswers?: Answers
	mock?: boolean
}

/** Use inquirer to get answers to the prompts from the user */
export const runPrompts = async ({
	prompts,
	cachedAnswers,
	injectedAnswers = {},
	mock,
}: PromptOptions): Promise<Answers> => {
	if (typeof injectedAnswers === 'string') {
		injectedAnswers = JSON.parse(injectedAnswers)
	}
	logger.debug('Generator injected answers:', injectedAnswers)

	const parsedPrompts: Prompt[] = prompts.map((prompt: Prompt, index) => {
		validatePrompt(prompt, index)

		// When mock, use the mock maually provided mock value or the default if it exists
		if (mock) {
			let injectMock: string | number | boolean | string[] | undefined
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
		} as Prompt
	})

	// if there are injected answers, then automatically answer the prompts included with the injected answers
	const answers: Answers = await inquirer.prompt(parsedPrompts, injectedAnswers)

	// get the list of prompts where it is of type list or chekcbox and plugin property is set to true
	const pluginPrompts = parsedPrompts.filter(
		(prompt) =>
			prompt.type === 'list' ||
			(prompt.type === 'checkbox' && prompt.plugin === true)
	)

	// get answers where the key is equal to the name of a propmt in pluginPrompts
	const pluginAnswers = pluginPrompts.reduce((acc, prompt) => {
		acc[prompt.name] = answers[prompt.name]
		return acc
	}, {})

	// get an array of plugins from the pluginAnswers values
	const plugins = Object.entries(pluginAnswers).reduce(
		(acc: string[], [key, value]) => {
			if (typeof value === 'boolean' && value) return [...acc, key]
			if (typeof value === 'string') return [...(acc as string[]), value]
			if (Array.isArray(value)) return [...(acc as string[]), ...value]
			return acc
		},
		[]
	)

	if (plugins.length > 0) answers.plugins = plugins

	return answers
}

export {
	ListPrompt,
	ConfirmPrompt,
	NumberPrompt,
	PasswordPrompt,
	CheckboxPrompt,
	InputPrompt,
}
