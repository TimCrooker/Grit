import { GeneratorConfig } from '@/index'

const config: GeneratorConfig = {
	prompts() {
		this.checkbox({
			plugin: true,
			name: 'plugin',
			message: 'Select plugins',
			choices: [
				{ name: 'Plugin 1', value: 'plugin1' },
				{ name: 'Plugin 2', value: 'plugin2' },
				{ name: 'Plugin 3', value: 'plugin3' },
			],
		})
	},
	actions: [
		{
			type: 'add',
			files: '**',
		},
		{
			type: 'move',
			patterns: {
				'_package.json': 'package.json',
				'_tsconfig.json': 'tsconfig.json',
			},
		},
	],
}

module.exports = config
