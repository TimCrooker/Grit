import { GritError } from '@/error'
import { logger } from '@/logger'
import inquirer, { DynamicQuestionProperty } from 'inquirer'
import Separator from 'inquirer/lib/objects/separator'

// ANSWER

export type Answers = Record<string, any>

export type Answer<T = any> = Record<string, T>

// CHOICE

/** Choice for list style prompts */
export type Choice = number | string | ListChoice | CheckboxChoice

export type Choices = Array<Choice | Separator>

/**
 * Represents a choice-item.
 */
interface ChoiceBase {
	/**
	 * The type of the choice.
	 */
	type?: string | undefined
}

/**
 * Provides options for a choice.
 */
interface ChoiceOptions extends ChoiceBase {
	/**
	 * @inheritdoc
	 */
	type?: 'choice' | undefined

	/**
	 * The name of the choice to show to the user.
	 */
	name: string

	/**
	 * The value of the choice.
	 */
	value: any

	/**
	 * The short form of the name of the choice.
	 */
	short?: string | undefined

	/**
	 * The extra properties of the choice.
	 */
	extra?: any
}

/**
 * Provides options for a choice of the `ListPrompt`.
 *
 * @template T
 * The type of the answers.
 */
export interface ListChoice<T extends Answers = Answers> extends ChoiceOptions {
	/**
	 * A value indicating whether the choice is disabled.
	 */
	disabled?: DynamicQuestionProperty<boolean | string, T> | undefined
}

/**
 * Provides options for a choice of the `CheckboxPrompt`.
 *
 * @template T
 * The type of the answers.
 */
export interface CheckboxChoice<T extends Answers = Answers>
	extends ListChoice<T> {
	/**
	 * A value indicating whether the choice should be initially checked.
	 */
	checked?: boolean | undefined
}

// PROMPT

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
