import { Grit } from '@/index'
import path from 'path'
import { moveAction } from '.'
import { CreateAction } from '../createAction'

// jest.mock('@/index')
let context: Grit

describe('move Action', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should move file to output', async () => {
		const action = CreateAction.move({
			patterns: {
				'foo.txt': 'newDir/foo.txt',
			},
		})

		await context.run()

		await moveAction(context, action)

		const hasFile = await context.hasOutputFile('newDir/foo.txt')

		expect(hasFile).toBeTruthy()
	})

	it('should remove old item', async () => {
		const action = CreateAction.move({
			patterns: {
				'foo.txt': 'newDir/foo.txt',
			},
		})

		await context.run()

		await moveAction(context, action)

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeFalsy()
	})

	it('should move and rename file', async () => {
		const action = CreateAction.move({
			patterns: {
				'foo.txt': 'fo.txt',
			},
		})

		await context.run()

		await moveAction(context, action)

		const hasFile = await context.hasOutputFile('fo.txt')

		expect(hasFile).toBeTruthy()
	})
})
