import { Grit, Prompt } from '@/index'
import { addPluginData } from '.'
const prompts: Prompt[] = [
	{
		type: 'list',
		name: 'plugin',
		plugin: true,
		message: 'Select plugin',
		choices: [
			{
				name: 'Plugin 1',
				value: 'plugin1',
			},
			{
				name: 'Plugin 2',
				value: 'plugin2',
			},
		],
	},
	{
		type: 'list',
		name: 'notplugin',
		message: 'Select plugin',
		choices: [
			{
				name: 'Plugin 1',
				value: 'plugin1',
			},
			{
				name: 'Plugin 2',
				value: 'plugin2',
			},
		],
	},
]

describe('Plugin data provider', () => {
	it('should provide selectedPlugins array with only plugin1', async () => {
		const dataProvider = await addPluginData(prompts, {
			plugin: 'plugin1',
			notplugin: 'plugin2',
		})

		const data = dataProvider(new Grit({ parsedGenerator: 'generator', mock: true }))

		expect(data).toMatchInlineSnapshot(`
      Object {
        "selectedPlugins": Array [
          "plugin1",
        ],
      }
    `)
	})
})
