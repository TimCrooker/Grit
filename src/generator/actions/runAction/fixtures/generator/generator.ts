/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GeneratorConfig } from '@/generator/generatorConfig'

module.exports = {
	actions() {
		return [
			this.actions.create.add({
				files: '**',
				data: (context) => ({ name: 'Tim' }),
			}),
			this.actions.create.move({
				patterns: {
					'bar.json': 'buz.json',
				},
			}),
		]
	},
} as GeneratorConfig
