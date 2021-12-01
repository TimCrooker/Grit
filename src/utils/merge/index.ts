/* eslint-disable @typescript-eslint/no-use-before-define */

import { PluginData } from '@/generator/plugins'
import _ from 'lodash'
import path from 'path'
import { readFileSync, requireUncached } from '../files'

/**
 * Merge a list of objects into the base object
 *
 * @param base the base object that will be merged into
 * @param objects a list of objects to merge into the base
 */
export const mergeObjects = (
	base = {},
	objects: Array<Record<string, any>>
): Record<string, any> => {
	function customizer(objValue, srcValue): unknown {
		if (_.isArray(objValue)) {
			return objValue.concat(srcValue)
		}
	}

	return objects.reduce((acc, obj) => {
		return _.mergeWith(acc, obj, customizer)
	}, base)
}

/**
 * Merge a base object with a list of json files privided via string paths
 *
 * @param base the base object to be merged into
 * @param filePaths a list of paths to json files to merge into the base
 */
export const mergeJsonFiles = (
	base = {},
	filePaths: string[]
): Record<string, any> => {
	// const files
	return mergeObjects(
		base,
		filePaths.map((file) => {
			if (file.endsWith('.json')) {
				return requireUncached(file)
			}
			return JSON.parse(readFileSync(file, 'utf8')) ?? {}
		})
	)
}

/**
 *
 * @param pluginPath path to the plugin pack directory
 * @param pluginName name of the plugin to target
 * @param fileName name of the file inside of a plugin to target
 * @returns the file being targeted in the specified plugin
 */
const getPluginFile = (
	pluginPath: string,
	fileName: string
): any | undefined => {
	try {
		const rawData = requireUncached(path.join(pluginPath, fileName))
		// const pluginFile = JSON.parse(rawData)
		return rawData
	} catch (e) {
		return undefined
	}
}

/**
 * Merge the JSON files of a particular name housed in each specified plugin directory.
 *
 * @param base object to merge json files into
 * @param pluginsDir the directory containing the plugin directories
 * @param pluginNames a list of plugins that will be included in the merged object
 * @param fileName the name of the file in each plugin to merge
 */
export const mergePluginJsonFiles = (
	base = {},
	pluginsDir: string,
	pluginNames: string[],
	fileName: string
): Record<string, any> => {
	const filePaths = pluginNames.map((pluginName) => {
		return path.resolve(pluginsDir, pluginName, fileName)
	})

	return mergeJsonFiles(base, filePaths)
}

/**
 * merge package.json and package.js files together into the final package.json
 *
 * @param base all of the data provided by the saoFile data function
 * @param pluginsPath path to the directory containing the plugins
 * @param plugins array of all selected plugins
 * @param answers user provided answers from prompts
 */
export const mergePackages = (
	base = {},
	plugins: PluginData[],
	answers: Record<string, any>
): Record<string, any> => {
	const basePkg = { ...base }
	const pluginPkgs = plugins.map((plugin) => {
		const pluginPkg = getPluginFile(plugin.dirPath, 'package.json')
		const pluginPkgFn = plugin.pluginFileData?.apply || undefined

		if (pluginPkgFn && pluginPkg) {
			const fnPkg = pluginPkgFn(pluginPkg, answers)
			return fnPkg
		} else if (pluginPkg) {
			return pluginPkg
		}
		return {}
	})

	const result = mergeObjects(basePkg, pluginPkgs) as Record<string, unknown>

	return result
}
