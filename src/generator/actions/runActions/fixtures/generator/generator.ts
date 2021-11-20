/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GeneratorConfig } from '@/generator/generatorConfig'

module.exports = {
	actions() {
		return [
			this.createAction.add({
				files: '**',
				data: (context) => ({ name: 'Tim' }),
			}),
			this.createAction.move({
				patterns: {
					'bar.json': 'buz.json',
				},
			}),
		]
	},
} as GeneratorConfig
