import { Grit } from '@/generator/index'
import path from 'path'

let grit: Grit

describe('Run Actions', () => {
	beforeEach(() => {
		grit = new Grit({
			generator: path.join(__dirname, 'fixtures', 'generator'),
			mock: true,
		})
	})

	it('should add everything from template to outDir', async () => {
		const name = 'Tim'

		await grit.run()

		await expect(grit.hasOutputFile('foo.txt')).resolves.toBeTruthy()

		await expect(grit.readOutputFile('foo.txt')).resolves.toEqual(name)

		const output = JSON.parse(await grit.readOutputFile('buz.json'))
		expect(output).toEqual({ bar: name })
	})
})
