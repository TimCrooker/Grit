import { Grit, Prompt } from '@/index'
import { pathExists } from '@/utils/files'
import { mergePluginJsonFiles } from '@/utils/merge'
import { pathExistsSync } from 'fs-extra'
import path from 'path'
import { Action, ActionProvider } from '../actions'
import { AddAction } from '../actions/action'
import { DataProvider } from '../data'
import { defautPluginFile } from './defaultPluginFile'
import {
	hasConfig,
	loadConfig,
	PluginFileConfig,
	pluginFileName,
} from './pluginConfig'

type PluginData = {
	name: string
	dirPath: string
	pluginFileData: any
}

export class Plugins {
	grit: Grit
	pluginsPath: string
	selectedPlugins: string[] = []
	pluginData: PluginData[] = []

	constructor(context: Grit) {
		this.grit = context
		this.pluginsPath = path.resolve(
			this.grit.parsedGenerator.path,
			this.grit.config.pluginsDir ?? 'plugins'
		)

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

	/** for each pluginData run the addAction function */
	async addPluginActions(): Promise<ActionProvider> {
		const mergeFiles: string[] = ['tsconfig.json', '.babelrc']

		const pluginActions: Action[] = []
		// for each pluginData run the addAction function

		/**
		 * Merge Plugins actions
		 */
		pluginActions.push(
			...this.pluginData.map((plugin) => {
				const action = {
					type: 'add',
					files: '**',
					templateDir: plugin.dirPath,
				} as AddAction

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

		for (const mergeFile of mergeFiles) {
			pluginActions.push({
				type: 'modify',
				files: mergeFile,
				handler: (fileData) => {
					return mergePluginJsonFiles(
						fileData,
						this.pluginsPath,
						this.selectedPlugins,
						mergeFile
					)
				},
			})
		}

		return (): Action[] => pluginActions
	}

	async addPluginData(prompts: Prompt[], answers: any): Promise<DataProvider> {
		// get the list of prompts where it is of type list or chekcbox and plugin property is set to true
		const pluginPrompts = prompts.filter(
			(prompt) =>
				(prompt.type === 'list' || prompt.type === 'checkbox') &&
				prompt.plugin === true
		)

		// get answers where the key is equal to the name of a propmt in pluginPrompts
		const pluginAnswers = pluginPrompts.reduce((acc, prompt) => {
			acc[prompt.name] = answers[prompt.name]
			return acc
		}, {})

		// get an array of plugins from the pluginAnswers values
		const plugins = Object.entries(pluginAnswers).reduce(
			(acc: string[], [key, value]) => {
				if (typeof value === 'boolean' && value) return [...acc, key]
				if (typeof value === 'string') return [...(acc as string[]), value]
				if (Array.isArray(value)) return [...(acc as string[]), ...value]
				return acc
			},
			[]
		)

		return (): Record<string, any> => ({
			selectedPlugins: plugins,
		})
	}

	// add all plugin files to the main project
	//
}
