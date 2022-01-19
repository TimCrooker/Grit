import { Grit, GritOptions } from '@/generator'
import { GeneratorConfig } from '../generatorConfig'

/*********************METHODS**********************/

class Generator {
	config: GeneratorConfig
	// Instantiate with local grit version
	grit = Grit

	constructor(generatorConfig: GeneratorConfig) {
		this.config = generatorConfig
	}

	getGeneratorInstance(opts: Omit<GritOptions, 'config'>): Grit {
		return new this.grit({ ...opts, config: this.config })
	}

	/** Run the generator allowing the user to pass runtime options */
	async run(opts: Omit<GritOptions, 'config'>): Promise<void> {
		const grit = this.getGeneratorInstance(opts)

		await grit.run()
	}
}

/*********************EXPORTS**********************/

export { Generator }
