import { Grit } from '@/generator/index'
import JoyCon from 'joycon'
import pa from 'path'
import { Action, Actions } from '../actions'
import { Prompt } from '../prompts/prompt'
import { globalRequire } from '@/utils/files'
import { Prompts } from '../prompts'
import { Data } from '../data'

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
	 * Extra data to use in template transformation
	 */
	data?: (
		this: Data,
		ctx: Grit
	) => DataType | Promise<DataType> | void | Promise<void>
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
	 * Use actions to control how files are generated
	 */
	actions?:
		| Action[]
		| ((
				this: Actions,
				ctx: Grit
		  ) => Action[] | Promise<Action[]> | void | Promise<void>)
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
	files: ['generator.js', 'generator.ts', 'generator.json'],
})

/** load the generator config file */
export const loadConfig = async (
	cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> => {
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
