import { Answers } from '@/generator/prompts/prompt'

export interface Ignore {
	/**
	 * List of plugins that the ignore applies to
	 * Defaults to all plugins
	 */
	plugin?: string[]
	/**
	 * function to determine if the files in the pattern should be ignored
	 *
	 * @param answers answers to the prompts
	 *
	 * @returns true if the file should be ignored
	 */
	when: (answers: Answers) => boolean
	/**'
	 * Glob pattern to match files to ignore
	 *
	 * @example ['**\/*.ts', '**\/*.js'] will ignore all files with a .ts or .js extension
	 */
	pattern: string[]
}

export interface PluginConfig {
	/**
	 * List of files to ignore when moving plugins into the main generator output Directory
	 */
	ignores?: Ignore[]
}
