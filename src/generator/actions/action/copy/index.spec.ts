import { Grit } from '@/generator'
import path from 'path'
import { copyAction } from '.'
import { createAction } from '../../createAction'

// jest.mock('@/index')
let context: Grit

describe('Copy Action', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should copy file to output', async () => {
		const action = createAction.copy({
			patterns: {
				'foo.txt': 'newDir/foo.txt',
			},
		})

		await context.run()

		await copyAction(context, action)

		const hasFile = await context.hasOutputFile('newDir/foo.txt')

		expect(hasFile).toBeTruthy()
	})

	it('should error on overwrite', async () => {
		const action = createAction.copy({
			patterns: {
				'foo.txt': 'foo.txt',
			},
		})

		await context.run()

		await expect(copyAction(context, action)).rejects.toThrow()
	})

	it('should copy and rename file', async () => {
		const action = createAction.copy({
			patterns: {
				'foo.txt': 'fo.txt',
			},
		})

		await context.run()

		await copyAction(context, action)

		const hasFile = await context.hasOutputFile('fo.txt')

		expect(hasFile).toBeTruthy()
	})
})
