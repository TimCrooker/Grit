import path from 'path'
import { Prompt } from './prompt'
import { prompt } from './prompt'
import { Grit } from '@/index'

const generator = path.join(__dirname, 'fixtures')

const prompts: Prompt[] = [
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
		const answers = await prompt({ prompts, mock: true })
		expect(answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('inject answers', async () => {
		const answers = await prompt({ prompts, injectedAnswers })
		expect(answers).toStrictEqual(injectedAnswers)
	})
})

describe('run prompts in generator instance', () => {
	it('Mock', async () => {
		const grit = new Grit({
			generator,
			mock: true,
		})

		await grit.run()

		expect(grit.answers).toStrictEqual({
			name: 'my name',
			age: '28',
		})
	})

	it('inject answers', async () => {
		const grit = new Grit({
			generator,
			outDir: path.join(__dirname, 'fixtures', 'output'),
			answers: injectedAnswers,
		})

		await grit.run()

		expect(grit.answers).toStrictEqual(injectedAnswers)
	})
})
