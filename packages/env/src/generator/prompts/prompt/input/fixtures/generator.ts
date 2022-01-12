import { Generator, GeneratorConfig } from '@/index'

const config: GeneratorConfig = {
	prompts() {
		this.input({
			name: 'input',
			message: 'Input something today',
			default: 'input',
		})
	},
}

module.exports = new Generator(config)
