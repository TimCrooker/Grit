import { getGenerator } from 'gritenv'
import path from 'path'

const generator = path.resolve(__dirname, '../')

describe('Generator variations', () => {
	it('Should render with plugins', async () => {
		const grit = await getGenerator({
			generator,
			mock: true,
			answers: {
				name: 'test',
				description: 'test',
				pluginTemplate: true,
				username: 'test',
				email: 'test',
				website: 'test',
			},
		})
		await grit.run()

		expect(await grit.getOutputFiles()).toMatchInlineSnapshot(`
      Array [
        ".gitignore",
        "LICENSE",
        "README.md",
        "babel.config.js",
        "generator.ts",
        "jest.config.js",
        "package.json",
        "plugins/plugin1/foo.txt",
        "plugins/plugin1/pluginFile.ts",
        "plugins/plugin2/bar.json",
        "plugins/plugin2/pluginFile.ts",
        "template/LICENSE",
        "template/README.md",
        "template/_package.json",
        "template/gitignore",
        "test/__snapshots__/index.spec.ts.snap",
        "test/index.spec.ts",
        "tsconfig.json",
      ]
    `)
	})

	it('Should render without plugins', async () => {
		const grit = await getGenerator({
			generator,
			mock: true,
			answers: {
				name: 'test',
				description: 'test',
				pluginTemplate: false,
				username: 'test',
				email: 'test',
				website: 'test',
			},
		})
		await grit.run()

		expect(await grit.getOutputFiles()).toMatchInlineSnapshot(`
      Array [
        ".gitignore",
        "LICENSE",
        "README.md",
        "babel.config.js",
        "generator.ts",
        "jest.config.js",
        "package.json",
        "plugins/plugin1/foo.txt",
        "plugins/plugin1/pluginFile.ts",
        "plugins/plugin2/bar.json",
        "plugins/plugin2/pluginFile.ts",
        "template/LICENSE",
        "template/README.md",
        "template/_package.json",
        "template/gitignore",
        "test/__snapshots__/index.spec.ts.snap",
        "test/index.spec.ts",
        "tsconfig.json",
      ]
    `)
	})
})
