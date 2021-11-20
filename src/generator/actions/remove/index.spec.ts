import { Grit } from '@/index'
import path from 'path'
import { removeAction } from '.'
import { CreateAction } from '../createActions'

let context: Grit

describe('Remove Action', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should remove file from output directory', async () => {
		const action = CreateAction.remove({
			files: 'foo.txt',
		})

		await context.run()

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeTruthy()

		await removeAction(context, action)

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeFalsy()
	})
})
