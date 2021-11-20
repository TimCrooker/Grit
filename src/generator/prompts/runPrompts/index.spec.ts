import path from 'path'
import { Grit } from '@/index'

const generator = path.join(__dirname, 'fixtures')

const injectedAnswers = {
	name: 'user',
	age: '35',
}

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
