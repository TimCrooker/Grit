import path from 'path'
import { loadGenerator } from '../getGenerator'
import { Generator } from '../createGenerator'
import { parseGenerator } from '../parseGenerator'

const genPath = path.resolve(__dirname, 'fixtures')
const parsedGenerator = parseGenerator(genPath)

describe('create locally versioned self-contained generator', () => {
	it('should return instantiated generator class containing local grit and generator config', async () => {
		const data = await loadGenerator(genPath)

		const generator = data.data as Generator

		expect(generator).toBeDefined()
		expect(generator.config).toBeDefined()
		expect(generator.grit).toBeDefined()

		expect(generator.config.prompts).toBeDefined()
		expect(generator.config.actions).toBeDefined()
		expect(generator.config.completed).toBeDefined()

		const instance = generator.getGeneratorInstance({
			mock: true,
			generator: parsedGenerator,
		})

		await instance.run()

		const outFiles = await instance.getOutputFiles()

		expect(outFiles).toMatchInlineSnapshot(`
      Array [
        "plugins/plugin1/foo.txt",
        "plugins/plugin1/pluginFile.ts",
        "plugins/plugin2/bar.json",
        "plugins/plugin2/pluginFile.ts",
      ]
    `)
	})
})
