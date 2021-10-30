import { GeneratorConfig } from '../generator/generator'

export const defautSaoFile: GeneratorConfig = {
	templateDir: '.',
	actions: [
		{
			type: 'add',
			files: '**',
		},
	],
	async completed() {
		this.gitInit()
		if (await this.hasOutputFile('package.json')) {
			await this.npmInstall()
		}
		this.showProjectTips()
	},
}
