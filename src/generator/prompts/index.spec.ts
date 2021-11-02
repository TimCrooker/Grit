import path from 'path'
import { Projen } from '../../'
import { prompt, PromptOptions } from './'

const generator = path.join(__dirname, 'fixtures')

const prompts: PromptOptions[] = [
	{
		name: 'name',
		type: 'input',
		message: 'input your name',
		default: 'my name',
	},
	{
		name: 'age',
		type: 'input',
		message: 'input your age',
		default: '28',
	},
]

const injectedAnswers = {
	name: 'user',
	age: '35',
}

describe('execute pure prompts', () => {
	it('Mock', async () => {
		const answers = await prompt(prompts, undefined, true)
		expect(answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('Use defaults', async () => {
		const answers = await prompt(prompts, true)
		expect(answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('inject answers', async () => {
		const answers = await prompt(prompts, injectedAnswers)
		expect(answers).toStrictEqual(injectedAnswers)
	})
})

describe('run prompts in generator instance', () => {
	it('Mock', async () => {
		const projen = new Projen({
			generator,
			mock: true,
		})

		await projen.run()

		expect(projen.answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('Use defaults', async () => {
		const projen = new Projen({
			generator,
			answers: true,
		})

		await projen.run()

		expect(projen.answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('inject answers', async () => {
		const projen = new Projen({
			generator,
			outDir: path.join(__dirname, 'fixtures', 'output'),
			answers: injectedAnswers,
		})

		await projen.run()

		expect(projen.answers).toStrictEqual(injectedAnswers)
	})
})
