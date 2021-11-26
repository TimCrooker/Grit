import { pathExists } from '@/utils/files'
import { pathExistsSync } from 'fs-extra'
import path from 'path'
import { defautPluginFile } from './defaultPluginFile'
import { hasConfig, loadConfig, PluginFileConfig } from './pluginConfig'

interface PluginsOptions {
	/** list of plugins to inject */
	selectedPlugins: string[]
	/** path to the directory containing the plugins */
	pluginsPath: string
}

type PluginData = {
	name: string
	dirPath: string
	pluginFileData: any
}

export class Plugins {
	selectedPlugins: string[] = []
	pluginsPath: string
	pluginData: PluginData[] = []

	constructor(options: PluginsOptions) {
		this.selectedPlugins = options.selectedPlugins
		this.pluginsPath = options.pluginsPath

		// check if pluginsPath is a valid path and thow error if it is not
		if (!pathExistsSync(this.pluginsPath)) {
			throw new Error(`Plugins path ${this.pluginsPath} does not exist`)
		}
	}

	async loadPlugins(plugins: string[] = this.selectedPlugins): Promise<void> {
		for (const plugin of plugins) {
			// check if selected plugin exists
			const pluginPath = path.join(this.pluginsPath, plugin)
			if (!(await pathExists(pluginPath))) {
				throw new Error(`Plugin ${plugin} does not exist`)
			}

			// ensure plugin has a pluginfile
			if (!hasConfig(pluginPath)) {
				throw new Error(`Plugin ${plugin} does not have a pluginfile`)
			}

			// load plugin file
			let pluginFileData: PluginFileConfig<unknown>
			try {
				const { data } = await loadConfig(pluginPath)
				pluginFileData = data
			} catch (e) {
				pluginFileData = defautPluginFile
			}

			// add plugin data to pluginData array
			this.pluginData.push({
				name: plugin,
				dirPath: pluginPath,
				pluginFileData,
			})
		}
	}

	// add all plugin files to the main project
	//
}
