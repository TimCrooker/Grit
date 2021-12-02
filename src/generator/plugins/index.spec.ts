import { getGenerator } from '@/cli/utils/getGenerator'
import path from 'path'
import { Plugins } from '.'

let pluginsWorker: Plugins

describe('Plugins', () => {
	beforeEach(() => {
		pluginsWorker = new Plugins({
			selectedPlugins: ['plugin1', 'plugin2', 'plugin3'],
			generatorPath: path.resolve(__dirname, 'fixtures'),
		})
	})

	it('should take plugins folder', () => {
		expect(pluginsWorker.pluginsDir).toBe(
			path.resolve(__dirname, 'fixtures', 'plugins')
		)
	})

	it('should take selected plugins', () => {
		expect(pluginsWorker.selectedPlugins).toEqual([
			'plugin1',
			'plugin2',
			'plugin3',
		])
	})

	it('should load plugin data', async () => {
		await pluginsWorker.loadPlugins()

		expect(pluginsWorker.pluginData[0].name).toEqual('plugin1')
		expect(pluginsWorker.pluginData[1].name).toEqual('plugin2')
		expect(pluginsWorker.pluginData[2].name).toEqual('plugin3')
	})

	it('should create actions', async () => {
		pluginsWorker.loadPlugins()
		const actionProvider = await pluginsWorker.addPluginActions()
		expect(actionProvider).toMatchInlineSnapshot(`[Function]`)

		const result = actionProvider(
			await getGenerator({ generator: 'generator', mock: true })
		)

		expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "files": "package.json",
          "handler": [Function],
          "type": "modify",
        },
        Object {
          "files": "tsconfig.json",
          "handler": [Function],
          "type": "modify",
        },
        Object {
          "files": ".babelrc",
          "handler": [Function],
          "type": "modify",
        },
      ]
    `)
	})

	it('Should merge json files from plugins', async () => {
		const grit = await (
			await getGenerator({
				generator: path.resolve(__dirname, 'fixtures'),
				answers: { plugin: ['plugin1', 'plugin2', 'plugin3'] },
				mock: true,
			})
		).run()

		expect(grit.data).toEqual({
			plugin: ['plugin1', 'plugin2', 'plugin3'],
			selectedPlugins: ['plugin1', 'plugin2', 'plugin3'],
		})

		await expect(grit.readOutputFile('package.json')).resolves
			.toMatchInlineSnapshot(`
            "{
              \\"name\\": \\"package\\",
              \\"dependencies\\": {
                \\"package-a\\": \\"2.0.0\\",
                \\"package-b\\": \\"1.0.0\\",
                \\"package-d\\": \\"1.0.0\\"
              },
              \\"devDependencies\\": {
                \\"package-c\\": \\"1.0.0\\"
              },
              \\"files\\": [
                \\"package.json\\",
                \\"package-a/package.json\\",
                \\"package-b/package.json\\",
                \\"package-c/package.json\\",
                \\"newfile\\"
              ]
            }"
          `)

		await expect(grit.readOutputFile('tsconfig.json')).resolves
			.toMatchInlineSnapshot(`
            "{
              \\"name\\": \\"package\\",
              \\"dependencies\\": {
                \\"package-a\\": \\"1.0.0\\",
                \\"package-b\\": \\"1.0.0\\"
              },
              \\"devDependencies\\": {
                \\"package-c\\": \\"1.0.0\\"
              },
              \\"files\\": [
                \\"package.json\\",
                \\"package-a/package.json\\",
                \\"package-b/package.json\\",
                \\"package-c/package.json\\",
                \\"package.json\\",
                \\"package-a/package.json\\",
                \\"package-b/package.json\\",
                \\"package-c/package.json\\",
                \\"package.json\\",
                \\"package-a/package.json\\",
                \\"package-b/package.json\\",
                \\"package-c/package.json\\",
                \\"package.json\\",
                \\"package-a/package.json\\",
                \\"package-b/package.json\\",
                \\"package-c/package.json\\"
              ]
            }"
          `)
	})
})
