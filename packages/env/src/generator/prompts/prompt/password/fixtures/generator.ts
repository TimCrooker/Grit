import { Generator, GeneratorConfig } from '@/index'

const config: GeneratorConfig = {
	prompts() {
		this.password({
			name: 'password',
			message: 'Put in a password baby',
			mask: '**',
			default: 'password',
		})
	},
}

module.exports = new Generator(config)
