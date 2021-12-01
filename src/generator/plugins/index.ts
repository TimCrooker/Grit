import { GeneratorConfig, Grit } from '@/index'
import { pathExists, pathExistsSync } from '@/utils/files'
import { mergePackages, mergePluginJsonFiles } from '@/utils/merge'
import path from 'path'
import { Action, ActionProvider } from '../actions'
import { AddAction } from '../actions/action'
import { Ignore } from './pluginConfig'
import { defautPluginFile } from './pluginFile/defaultPluginFile'
import {
	hasConfig,
	loadConfig,
	PluginFileConfig,
	pluginFileName,
} from './pluginFile/pluginConfig'

export type PluginData = {
	name: string
	dirPath: string
	pluginFileData: PluginFileConfig
}

interface PluginsOptions {
	selectedPlugins: string[]
	generatorPath: string
	config?: GeneratorConfig['plugins']
}

export class Plugins {
	pluginsDir: string
	ignores: Ignore[]

	selectedPlugins: string[]
	pluginData: PluginData[] = []

	constructor(options: PluginsOptions) {
		this.pluginsDir = path.resolve(options.generatorPath, 'plugins')

		this.ignores = options.config?.ignores || []
		this.selectedPlugins = options.selectedPlugins

		// Check if the pluginsDir exists and if not then throw error
		if (!pathExistsSync(this.pluginsDir)) {
			throw new Error(`Plugins directory does not exist at ${this.pluginsDir}`)
		}
	}

	async loadPlugins(plugins = this.selectedPlugins): Promise<void> {
		const pluginData: PluginData[] = []
		// load plugin data for selected plugins
		for (const plugin of plugins) {
			// check if selected plugin exists
			const pluginPath = path.join(this.pluginsDir, plugin)
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
			pluginData.push({
				name: plugin,
				dirPath: pluginPath,
				pluginFileData,
			})
		}

		this.pluginData = pluginData
	}

	/** for each pluginData run the addAction function */
	async addPluginActions(): Promise<ActionProvider> {
		const mergeFiles: string[] = ['package.json', 'tsconfig.json', '.babelrc']

		const pluginActions: Action[] = []
		// for each pluginData run the addAction function

		return (grit: Grit): Action[] => {
			// Merge plugins files
			pluginActions.push(
				...this.pluginData.map((plugin) => {
					const action = {
						type: 'add',
						files: '**',
						templateDir: plugin.dirPath,
					} as AddAction

					action.filters = {}

					// dont add `pluginfile` to output
					for (const filename of pluginFileName) {
						action.filters[filename] = false
					}

					// ignore generator supplied ignores

					// ignore common json config files to they can be merged later
					for (const filename of mergeFiles) {
						action.filters[filename] = false
					}

					return action
				})
			)

			// Sepecially handle the `package.json` file
			pluginActions.push({
				type: 'modify',
				files: 'package.json',
				handler: (fileData) => {
					return mergePackages(fileData, this.pluginData, grit.answers)
				},
			})

			for (const mergeFile of mergeFiles) {
				if (mergeFile === 'package.json') continue

				pluginActions.push({
					type: 'modify',
					files: mergeFile,
					handler: (fileData) => {
						return mergePluginJsonFiles(
							fileData,
							this.pluginsDir,
							this.selectedPlugins,
							mergeFile
						)
					},
				})
			}
			return pluginActions
		}
	}
}
