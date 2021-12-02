/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GeneratorConfig } from '@/cli/utils/generatorConfig'

module.exports = {
	actions() {
		this.add({
			files: '**',
			data: () => ({ name: 'Tim' }),
		})

		this.move({
			patterns: {
				'bar.json': 'buz.json',
			},
		})

		this.copy({
			patterns: {
				'buz.json': 'bill.json',
				'foo.txt': 'copy.txt',
			},
		})

		this.modify({
			files: '**/*.json',
			handler: (data) => {
				return { ...data, extra: 'extra' }
			},
		})

		this.remove({
			files: 'copy.txt',
		})
	},
} as GeneratorConfig