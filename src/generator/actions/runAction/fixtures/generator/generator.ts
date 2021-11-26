/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GeneratorConfig } from '@/generator/generatorConfig'

module.exports = {
	actions() {
		this.add({
			files: '**',
			data: (context) => ({ name: 'Tim' }),
		})

		this.move({
			patterns: {
				'bar.json': 'buz.json',
			},
		})
	},
} as GeneratorConfig
