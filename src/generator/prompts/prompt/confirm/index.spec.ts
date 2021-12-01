import { Grit } from '@/generator'
import path from 'path'

const generator = path.join(__dirname, 'fixtures')

const injectedAnswers = {
	confirm: false,
}

describe('run confirm prompt in generator instance', () => {
	it('Mock', async () => {
		const grit = new Grit({
			generator,
			mock: true,
		})

		await grit.run()

		expect(grit.answers).toStrictEqual({
			confirm: true,
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
