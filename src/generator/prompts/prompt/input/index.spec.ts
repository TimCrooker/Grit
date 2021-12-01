import { Grit } from '@/generator'
import path from 'path'

const generator = path.join(__dirname, 'fixtures')

const injectedAnswers = {
	input: 'input',
}

describe('run confirm prompt in generator instance', () => {
	it('Should use default for mock', async () => {
		const grit = new Grit({
			generator,
			mock: true,
		})

		await grit.run()

		expect(grit.answers).toStrictEqual(injectedAnswers)
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
