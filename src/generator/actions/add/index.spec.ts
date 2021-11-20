import { Grit } from '@/index'
import path from 'path'
import { addAction } from '.'
import { CreateAction } from '../createAction'

let context: Grit

describe('Add Action', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should add everything from template to outDir', async () => {
		const action = CreateAction.add({
			files: '**',
			templateDir: path.join(__dirname, 'fixtures', 'generator', 'template'),
			transform: false,
		})

		context.answers = {}

		await addAction(context, action, {})

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeTruthy()
		await expect(context.hasOutputFile('bar.json')).resolves.toBeTruthy()
	})

	it('should transform file', async () => {
		const action = CreateAction.add({
			files: '**',
			templateDir: path.join(__dirname, 'fixtures', 'generator', 'template'),
		})

		const name = 'Tim'

		context.answers = {
			name,
		}

		await addAction(context, action, {})

		await expect(context.readOutputFile('foo.txt')).resolves.toEqual(name)

		const output = JSON.parse(await context.readOutputFile('bar.json'))
		expect(output).toEqual({ bar: name })
	})

	it('should exclude foo.txt from transform', async () => {
		const action = CreateAction.add({
			files: '**',
			templateDir: path.join(__dirname, 'fixtures', 'generator', 'template'),
			transformExclude: ['foo.txt'],
		})

		const name = 'Tim'

		context.answers = {
			name,
		}

		await addAction(context, action, {})

		await expect(context.readOutputFile('foo.txt')).resolves.toEqual(
			'<%= name %>'
		)

		const output = JSON.parse(await context.readOutputFile('bar.json'))
		expect(output).toEqual({ bar: name })
	})

	it('should include only foo.txt for transform', async () => {
		const action = CreateAction.add({
			files: '**',
			templateDir: path.join(__dirname, 'fixtures', 'generator', 'template'),
			transformInclude: ['foo.txt'],
		})

		const name = 'Tim'

		context.answers = {
			name,
		}

		await addAction(context, action, {})

		await expect(context.readOutputFile('foo.txt')).resolves.toEqual(name)

		const output = JSON.parse(await context.readOutputFile('bar.json'))
		expect(output).toEqual({ bar: '<%= name %>' })
	})

	it('should use data function to transform files', async () => {
		const name = 'Tim'
		const action = CreateAction.add({
			files: '**',
			templateDir: path.join(__dirname, 'fixtures', 'generator', 'template'),
			data: (context) => ({ name }),
		})

		context.answers = {}

		await addAction(context, action, {})

		await expect(context.readOutputFile('foo.txt')).resolves.toEqual(name)

		const output = JSON.parse(await context.readOutputFile('bar.json'))
		expect(output).toEqual({ bar: name })
	})
})
