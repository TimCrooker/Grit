import { Grit } from '@/index'
import path from 'path'

let context: Grit

describe('Run Actions', () => {
	beforeEach(() => {
		context = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should add everything from template to outDir', async () => {
		const name = 'Tim'

		await context.run()

		await expect(context.hasOutputFile('foo.txt')).resolves.toBeTruthy()

		await expect(context.readOutputFile('foo.txt')).resolves.toEqual(name)

		const output = JSON.parse(await context.readOutputFile('buz.json'))
		expect(output).toEqual({ bar: name })
	})
})
