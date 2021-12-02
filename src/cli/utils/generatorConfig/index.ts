import { Grit } from '@/generator/index'
import JoyCon from 'joycon'
import pa from 'path'
import { Action, Actions } from '../../../generator/actions'
import { Prompt } from '../../../generator/prompts/prompt'
import { globalRequire } from '@/utils/files'
import { Prompts } from '../../../generator/prompts'
import { Data } from '../../../generator/data'
import { Completed } from '../../../generator/data/completed'
import { Prepare } from '../../../generator/prepare'
import { logger } from '@/logger'
import { PluginConfig } from '../../../generator/plugins/pluginConfig'

export type DataType = Record<string, any>

export interface GeneratorConfig {
	/**
	 * Generator description
	 * Used in CLI output
	 */
	description?: string
	/**
	 * Check updates for npm generators
	 * Defaults to `true`
	 */
	updateCheck?: boolean
	/**
	 * Transform template content with `ejs`
	 * Defaults to `true`
	 */
	transform?: boolean
	/**
	 * Directory to template folder
	 * Defaults to `./template` in your generator folder
	 */
	templateDir?: string
	/**
	 * Run some operations before running actions
	 */
	prepare?: (this: Prepare, ctx: Grit) => Promise<void> | void
	/**
	 * Use prompts to ask questions before generating project
	 */
	prompts?:
		| Prompt[]
		| ((
				this: Prompts,
				ctx: Grit
		  ) => Prompt[] | Promise<Prompt[]> | void | Promise<void>)
	/**
	 *
	 */
	plugins?: PluginConfig
	/**
	 * Extra data to use in template transformation
	 */
	data?: (
		this: Data,
		ctx: Grit
	) => DataType | Promise<DataType> | void | Promise<void>
	/**
	 * Use actions to control how files are generated
	 */
	actions?:
		| Action[]
		| ((
				this: Actions,
				ctx: Grit
		  ) => Action[] | Promise<Action[]> | void | Promise<void>)
	/**
	 * Run some operations when completed
	 * e.g. log some success message
	 */
	completed?: (this: Completed, ctx: Grit) => Promise<void> | void
}

const joycon = new JoyCon({
	files: ['generator.js', 'generator.ts', 'generator.json'],
})

/** load the generator config file */
export const loadConfig = async (
	cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> => {
	logger.debug('loading generator from path:', cwd)
	const { path } = await joycon.load({
		cwd,
		stopDir: pa.dirname(cwd),
	})
	const data = path ? await globalRequire(path) : undefined

	return { path, data }
}

/** Check generator has config file */
export const hasConfig = (cwd: string): boolean => {
	return Boolean(
		joycon.resolve({
			cwd,
			stopDir: pa.dirname(cwd),
		})
	)
}
