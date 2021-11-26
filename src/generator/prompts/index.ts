import { GeneratorConfig, Grit, store } from '@/index'
import { logger } from '@/logger'
import resolveFrom from 'resolve-from'
import { createPrompt, RemovePromptType } from './createPrompt'
import {
	Answers,
	CheckboxPrompt,
	ConfirmPrompt,
	InputPrompt,
	ListPrompt,
	NumberPrompt,
	PasswordPrompt,
	Prompt,
	runPrompts,
} from './prompt'

export class Prompts {
	prompts: Prompt[] = []
	grit: Grit
	private _answers: Answers = {}

	constructor(context: Grit) {
		this.grit = context
	}

	async run(grit: Grit = this.grit): Promise<void> {
		const { mock, answers: injectedAnswers } = grit.opts

		// Gets prompts from the generator config
		await this.getPrompts()

		// Gets cached answers from the store
		const pkgPath = resolveFrom.silent(
			grit.parsedGenerator.path,
			'./package.json'
		)
		const pkgVersion = pkgPath ? require(pkgPath).version : ''
		const CACHED_ANSWERS_ID = `${
			grit.parsedGenerator.hash + pkgVersion.replace(/\./g, '\\.')
		}`
		const cachedAnswers = store.answers.get(CACHED_ANSWERS_ID)
		if (!mock) {
			logger.debug('Loaded cached answers:', cachedAnswers)
		}

		// Run prompts supplied by the generator
		const answers = await runPrompts({
			prompts: this.prompts,
			cachedAnswers,
			injectedAnswers,
			mock,
		})
		logger.debug(`Retrived answers:`, answers)

		// Cache new answers
		const answersToStore: Answers = {}
		for (const p of this.prompts) {
			if (!Object.prototype.hasOwnProperty.call(answers, p.name)) {
				answers[p.name] = undefined
			}
			if (p.store) {
				answersToStore[p.name] = answers[p.name]
			}
		}
		if (!mock) {
			store.answers.set(CACHED_ANSWERS_ID, answersToStore)
			logger.debug('Caching prompt answers:', answersToStore)
		}

		this._answers = answers
	}

	/** Takes a prompt object and throw an exception if it is not valid */
	private validate(prompt: Prompt, index: number): void {
		if (!prompt.type) {
			throw new Error(`Missing property "type" on prompt # ${index + 1})`)
		}

		if (!prompt.message) {
			throw new Error(`Missing property "message" on prompt (index: ${index})`)
		}

		if (!prompt.name) {
			throw new Error(`Missing property "name" on prompt (index: ${index})`)
		}
	}

	/** Get the list of prompts from the generator file */
	async getPrompts(
		context: Grit = this.grit,
		config: GeneratorConfig['prompts'] = this.grit.config.prompts
	): Promise<void> {
		const promptsArray =
			typeof config === 'function' ? await config.call(this, context) : config

		if (!promptsArray || promptsArray.length === 0) return

		this.prompts = [...this.prompts, ...promptsArray]
	}

	/**
	 * Runtime availiable methods
	 */

	/** Add a prompt or an array of prompts to the generator */
	newPrompt(prompt: Prompt | Prompt[]): void {
		const validateAndPush = (prompt: Prompt): void => {
			this.validate(prompt, this.prompts.length)
			this.prompts.push(prompt)
		}

		if (Array.isArray(prompt)) {
			prompt.forEach((prompt) => {
				validateAndPush(prompt)
			})
		} else {
			validateAndPush(prompt)
		}
	}

	input(action: RemovePromptType<InputPrompt>): this {
		this.newPrompt(createPrompt.input(action))
		return this
	}

	password(action: RemovePromptType<PasswordPrompt>): this {
		this.newPrompt(createPrompt.password(action))
		return this
	}

	number(action: RemovePromptType<NumberPrompt>): this {
		this.newPrompt(createPrompt.number(action))
		return this
	}

	confirm(action: RemovePromptType<ConfirmPrompt>): this {
		this.newPrompt(createPrompt.confirm(action))
		return this
	}

	checkbox(action: RemovePromptType<CheckboxPrompt>): this {
		this.newPrompt(createPrompt.checkbox(action))
		return this
	}

	list(action: RemovePromptType<ListPrompt>): this {
		this.newPrompt(createPrompt.list(action))
		return this
	}

	/** Runtime availiable Properties */

	get answers(): Answers {
		return this._answers
	}

	set answers(value: Record<string, any>) {
		this._answers = value
	}
}

export { Prompt } from './prompt'
