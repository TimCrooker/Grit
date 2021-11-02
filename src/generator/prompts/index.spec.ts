import { Projen } from '../../index'
import path from 'path'

describe('prompts', () => {
	test('Input prompts', async () => {
		const projen = new Projen({
			generator: path.join(__dirname, 'fixtures'),
			mock: true,
		})

		await projen.run()

		expect(projen.answers).toEqual({
			name: 'my name',
			age: '28',
		})
	})
})
