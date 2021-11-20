import { Grit } from '@/index'
import JoyCon from 'joycon'
import pa from 'path'
import { Action } from '../actions'
import { Prompt } from '../prompts/prompt'
import { transpileModule } from 'typescript'
import { readFile } from '@/utils/files'
import { unlinkSync, writeFileSync } from 'fs'
import module from 'module'

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
	files: ['generator.js', 'generator.ts', 'generator.json'],
})

const tsTranspile = async (
	tsCodePath: string
): Promise<{ path: string; data: any }> => {
	if (!pa.resolve(tsCodePath))
		throw new Error(`Couldn't find tsFile at path: ${tsCodePath}`)

	// get the ts code
	const tsCode = await readFile(tsCodePath, 'utf8')

	// transpile the ts code into a js string
	const { outputText: jsText } = await transpileModule(tsCode, {
		/* Here the compiler options */
	})

	// set js file path to the same as ts file path but as temp.js
	const jsCodePath = pa.join(tsCodePath, '../temp.js')

	// write the js code to the temp file
	writeFileSync(jsCodePath, jsText)

	// turn the file path into a module with import
	const jsModule = await import(jsCodePath)

	// remove the temp file
	unlinkSync(jsCodePath)

	return { path: jsCodePath, data: jsModule }
}

/** load the generator config file */
export const loadConfig = async (
	cwd: string
): Promise<{ path?: string; data?: GeneratorConfig }> => {
	const { path, data } = await joycon.load({
		cwd,
		stopDir: pa.dirname(cwd),
	})

	if (path && pa.extname(path) === '.ts') {
		return await tsTranspile(path)
	}

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
