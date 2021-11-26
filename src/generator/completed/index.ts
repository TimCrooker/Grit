import { GeneratorConfig, Grit } from '@/index'
import { logger } from '@/logger'
import { RunNpmScriptOptions, runNpmScript } from '@/utils/cmd'
import { exec } from 'child_process'
import spawn from 'cross-spawn'
import { promisify } from 'util'

export class Completed {
	grit: Grit

	constructor(context: Grit) {
		this.grit = context
	}

	async run(
		grit: Grit = this.grit,
		config: GeneratorConfig['completed'] = this.grit.config.completed
	): Promise<void> {
		// Runs completed section from the generator config
		typeof config === 'function' && (await config.call(this, grit))
	}

	/**
	 * Runtime availiable methods
	 */

	/**
	 * Runtime availiable Properties
	 */
}
