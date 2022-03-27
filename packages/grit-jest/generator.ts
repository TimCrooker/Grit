import path from 'path'
import { GeneratorConfig, Generator } from 'gritenv'

const config = {
	plugins: {
		mergeFiles: [],
	},
	actions() {
		this.add({
			files: '**',
		})
		this.move({
			patterns: {
				gitignore: '.gitignore',
				'_package.json': 'package.json',
			},
		})
	},
	async completed(grit) {
		await grit.npmInstall()
	},
} as GeneratorConfig

export = new Generator(config)
