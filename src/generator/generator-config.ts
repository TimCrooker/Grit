import JoyCon from 'joycon'
import path from 'path'
import { APP_NAME } from '../config'
import { Grit } from '.'
import { PromptType } from './prompt/prompt'

export interface AddAction {
	type: 'add'
	templateDir?: string
	files: string[] | string
	filters?: {
		[k: string]: string | boolean | null | undefined
	}
	/** Transform the template with ejs */
	transform?: boolean
	/**
	 * Only transform files matching given minimatch patterns
	 */
	transformInclude?: string[]
	/**
	 * Don't transform files matching given minimatch patterns
	 */
	transformExclude?: string
	/**
	 * Custom data to use in template transformation
	 */
	data?: DataFunction | object
}

type DataFunction = (this: Grit, context: Grit) => object

export interface MoveAction {
	type: 'move'
	patterns: {
		[k: string]: string
	}
}

export interface CopyAction {
	type: 'copy'
	patterns: {
		[k: string]: string
	}
}

export interface ModifyAction {
	/** Identify this action as the modify type */
	type: 'modify'
	/** Glob patterns to identify items inside of the project directory */
	files: string | string[]
	/**  */
	handler: (data: any, filepath: string) => any
}

export interface RemoveAction {
	type: 'remove'
	files: string | string[] | { [k: string]: string | boolean }
	when: boolean | string
}

export type Action =
	| AddAction
	| MoveAction
	| CopyAction
	| ModifyAction
	| RemoveAction

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
	prompts?:
		| PromptType[]
		| ((this: Grit, ctx: Grit) => PromptType[] | Promise<PromptType[]>)
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
	files: [
		'generator.js',
		'generator.mjs',
		'generator.json',
		`${APP_NAME}.js`,
		`${APP_NAME}.mjs`,
		`${APP_NAME}.json`,
	],
})

/** load the generator config file */
export const loadConfig = (
	cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> => {
	return joycon.load({
		cwd,
		stopDir: path.dirname(cwd),
	})
}

/** Check generator has config file */
export const hasConfig = (cwd: string): boolean => {
	return Boolean(
		joycon.resolve({
			cwd,
			stopDir: path.dirname(cwd),
		})
	)
}
