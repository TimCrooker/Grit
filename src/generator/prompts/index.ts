import { GeneratorConfig, Grit, store } from '@/index'
import { logger } from '@/logger'
import resolveFrom from 'resolve-from'
import { createPrompt } from './createPrompt'
import { Answers, Prompt, prompt } from './prompt'

export class Prompts {
	prompts: Prompt[] = []
	/** Used to create prompts easily and safely. */
	create = createPrompt

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

	async getPrompts(
		context: Grit,
		config: GeneratorConfig['prompts']
	): Promise<void> {
		const promptsArray =
			typeof config === 'function'
				? await config.call(context, context)
				: config

		if (!promptsArray || promptsArray.length === 0) return

		this.prompts = [...this.prompts, ...promptsArray]
	}

	async run(context: Grit, config: GeneratorConfig): Promise<Answers> {
		const { mock, answers: injectedAnswers } = context.opts

		// Gets prompts from the generator config
		await this.getPrompts(context, config.prompts)

		// Gets cached answers from the store
		const pkgPath = resolveFrom.silent(
			context.parsedGenerator.path,
			'./package.json'
		)
		const pkgVersion = pkgPath ? require(pkgPath).version : ''
		const CACHED_ANSWERS_ID = `${
			context.parsedGenerator.hash + pkgVersion.replace(/\./g, '\\.')
		}`
		const cachedAnswers = store.answers.get(CACHED_ANSWERS_ID)
		if (!mock) {
			logger.debug('Loaded cached answers:', cachedAnswers)
		}

		// Run prompts supplied by the generator
		const answers = await prompt({
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

		return answers
	}

	/** Add a prompt or an array of prompts to the generator */
	add(prompt: Prompt | Prompt[]): void {
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
}

export { Prompt } from './prompt'
