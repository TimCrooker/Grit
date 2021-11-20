import { Grit } from '@/index'
import JoyCon from 'joycon'
import pa from 'path'
import { Action } from '../actions'
import { Prompt } from '../prompts/prompt'

export type DataFunction = (this: Grit, context: Grit) => object

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
	 * Extra data to use in template transformation
	 */
	data?: DataFunction
	/**
	 * Use prompts to ask questions before generating project
	 */
	prompts?: Prompt[] | ((this: Grit, ctx: Grit) => Prompt[] | Promise<Prompt[]>)
	/**
	 * Use actions to control how files are generated
	 */
	actions?: Action[] | ((this: Grit, ctx: Grit) => Action[] | Promise<Action[]>)
	/**
	 * Directory to template folder
	 * Defaults to `./template` in your generator folder
	 */
	templateDir?: string
	/**
	 * Run some operations before running actions
	 */
	prepare?: (this: Grit, ctx: Grit) => Promise<void> | void
	/**
	 * Run some operations when completed
	 * e.g. log some success message
	 */
	completed?: (this: Grit, ctx: Grit) => Promise<void> | void
}

const joycon = new JoyCon({
	files: ['generator.js', 'generator.json', `gritfile.js`, `gritfile.json`],
})

/** load the generator config file */
export const loadConfig = (
	cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> => {
	return joycon.load({
		cwd,
		stopDir: pa.dirname(cwd),
	})
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
