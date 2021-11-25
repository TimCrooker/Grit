import { Action } from '@/generator/actions'
import { isDirectory } from '@/utils/files'
import path from 'path/posix'

interface CreatePluginActionsOptions {
	plugins: string[]
	pluginsDirPath?: string
}

export const createPluginActions = ({
	plugins,
	pluginsDirPath,
}: CreatePluginActionsOptions): Action[] => {
	const actions: Action[] = []

	// check if pluginsDirPath is a directory
	const pluginsPath =
		pluginsDirPath && isDirectory(pluginsDirPath)
			? path.resolve(pluginsDirPath)
			: './plugins'
	//for each plugin add an action to the list
	plugins.forEach((plugin) => {
		const pluginPath = path.join(pluginsPath, plugin)
		
		actions.push({})
	})

	return actions
}
