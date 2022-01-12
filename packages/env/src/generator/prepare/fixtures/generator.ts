import { Generator, GeneratorConfig } from '@/index'

const config: GeneratorConfig = {
	prepare(grit) {
		grit.answers = { name: 'Tim' }
	},
}

module.exports = new Generator(config)
