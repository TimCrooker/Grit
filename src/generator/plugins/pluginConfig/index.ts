import { globalRequire } from '@/utils/files'
import JoyCon from 'joycon'
import pa from 'path'

export type Extend<T> =
	| Partial<T>
	| ((answers: Record<string, any>) => Partial<T>)

export type Package = Record<string, any>

export type Apply<T> = (
	pkg: Package,
	answers: Record<string, any>
) => Partial<T>

export interface PluginFileConfig<T> {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * Description of the plugin.
	 */
	description: string
	/**
	 * relevant URL for docs / help / links / etc. for the plugin.
	 */
	url?: string
	/**
	 * This is used to inject properties methods or really whatever you want directly into files
	 *
	 * Can be an object or a function that returns an object containing the properties you want to inject.
	 *
	 * function will recieve an object containing the answers the user provided
	 */
	extend?: Extend<T>
	/**
	 *
	 */
	apply?: Apply<T>
}

const joycon = new JoyCon({
	files: ['pluginFile.ts', 'pluginFile.js', 'pluginfile.ts', 'pluginfile.js'],
})

/** load the generator config file */
export const loadConfig = async (
	cwd: string
): Promise<{ filePath: string; data: PluginFileConfig<unknown> }> => {
	const { path } = await joycon.load({
		cwd,
		stopDir: pa.dirname(cwd),
	})

	if (!path) throw new Error(`No plugin file found`)

	const data = path ? await globalRequire(path) : undefined

	return { filePath: path, data }
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