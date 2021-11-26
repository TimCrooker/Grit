import path from 'path'
import { Plugins } from '.'

let pluginsWorker: Plugins

describe('Plugins', () => {
	beforeEach(() => {
		pluginsWorker = new Plugins({
			selectedPlugins: ['plugin1', 'plugin2', 'plugin3'],
			pluginsPath: path.resolve(__dirname, 'fixtures', 'plugins'),
		})
	})

	it('should take plugins folder', () => {
		expect(pluginsWorker.pluginsPath).toBe(
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
		expect(pluginsWorker.pluginData).toMatchInlineSnapshot(`
      Array [
        Object {
          "dirPath": "C:\\\\Users\\\\crook\\\\Documents\\\\Grit\\\\grit-cli\\\\src\\\\generator\\\\plugins\\\\fixtures\\\\plugins\\\\plugin1",
          "name": "plugin1",
          "pluginFileData": Object {
            "default": Object {},
          },
        },
        Object {
          "dirPath": "C:\\\\Users\\\\crook\\\\Documents\\\\Grit\\\\grit-cli\\\\src\\\\generator\\\\plugins\\\\fixtures\\\\plugins\\\\plugin2",
          "name": "plugin2",
          "pluginFileData": Object {
            "default": Object {},
          },
        },
        Object {
          "dirPath": "C:\\\\Users\\\\crook\\\\Documents\\\\Grit\\\\grit-cli\\\\src\\\\generator\\\\plugins\\\\fixtures\\\\plugins\\\\plugin3",
          "name": "plugin3",
          "pluginFileData": Object {
            "default": Object {},
          },
        },
      ]
    `)
	})
})
