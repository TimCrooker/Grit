import { GeneratorConfig } from '../generatorConfig/generator-config'

export const defautGeneratorFile: GeneratorConfig = {
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
