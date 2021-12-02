import { globalRequire } from '@/utils/files'
import JoyCon from 'joycon'
import { PluginFileConfig, pluginFileName } from '../pluginFileConfig'
import pa from 'path'

const joycon = new JoyCon({
	files: pluginFileName,
})

/** load the generator config file */
export const loadPluginConfig = async (
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
export const hasPluginConfig = (cwd: string): boolean => {
	return Boolean(
		joycon.resolve({
			cwd,
			stopDir: pa.dirname(cwd),
		})
	)
}
