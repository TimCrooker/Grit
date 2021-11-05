import resolveFrom from 'resolve-from'
import { store } from '../../store'
import { prompt } from './'
import { Answers, GeneratorConfig, Grit } from '../..'

import { logger } from '../../utils/logger'

export const runPrompts = async (
	context: Grit,
	config: GeneratorConfig
): Promise<Answers> => {
	// Gets prompts from the generator config
	const prompts =
		typeof config.prompts === 'function'
			? await config.prompts.call(context, context)
			: config.prompts

	if (!prompts || prompts.length === 0) {
		return {}
	}

	const pkgPath = resolveFrom.silent(
		context.parsedGenerator.path,
		'./package.json'
	)
	const pkgVersion = pkgPath ? require(pkgPath).version : ''
	const CACHED_ANSWERS_ID = `answers.${
		context.parsedGenerator.hash + pkgVersion.replace(/\./g, '\\.')
	}`

	// get cached answers
	const cachedAnswers = store.get(CACHED_ANSWERS_ID) || {}

	const { mock, answers: injectedAnswers } = context.opts

	if (!mock) {
		logger.debug('Loaded cached answers:', cachedAnswers)
	}

	if (injectedAnswers === true) {
		logger.warn(
			`The yes flag has been set. This will automatically answer default value to all questions, which may have security implications.`
		)
	}

	// Run enquirer on the prompts supplied by the generator
	const answers = await prompt(prompts, cachedAnswers, injectedAnswers, mock)
	logger.debug(`Retrived answers:`, answers)

	// cache answers
	const answersToStore: { [k: string]: any } = {}
	for (const p of prompts) {
		if (!Object.prototype.hasOwnProperty.call(answers, p.name)) {
			answers[p.name] = undefined
		}
		if (p.store) {
			answersToStore[p.name] = answers[p.name]
		}
	}
	if (!mock) {
		store.set(CACHED_ANSWERS_ID, answersToStore)
		logger.debug('Cached prompt answers:', answersToStore)
	}

	return answers
}
