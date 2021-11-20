import { Grit } from '@/index'
import path from 'path'
import { modifyAction } from '.'
import { CreateAction } from '../createAction'

// jest.mock('@/index')
let context: Grit

describe('Modify Action', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should modify text file contents', async () => {
		const action = CreateAction.modify({
			files: ['foo.txt'],
			handler: (data, filepath) => {
				return 'bar'
			},
		})

		await context.run()

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeTruthy()

		await expect(context.readOutputFile('foo.txt')).resolves.toBe('foo')

		await modifyAction(context, action)

		await expect(context.readOutputFile('foo.txt')).resolves.toBe('bar')
	})

	it('should modify JSON file contents', async () => {
		const action = CreateAction.modify({
			files: ['bar.json'],
			handler: (data, filepath) => {
				console.log(data, filepath)
				return { bar: true }
			},
		})

		await context.run()

		await expect(context.hasOutputFile('bar.json')).resolves.toBeTruthy()

		const beforeModify = JSON.parse(await context.readOutputFile('bar.json'))

		expect(beforeModify).toEqual({
			bar: false,
		})

		await modifyAction(context, action)

		const afterModify = JSON.parse(await context.readOutputFile('bar.json'))

		expect(afterModify).toEqual({
			bar: true,
		})
	})
})
