// type mergerFn = (base: Record<string, any>, ) => Record<string, any>

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
		return path.join(pluginsDir, pluginName, fileName)
	})

	return mergeJsonFiles(base, filePaths)
}

// const getPluginFile = (
// 	pluginPath: string,
// 	pluginName: string,
// 	fileName: string
// ): any | undefined => {
// 	try {
// 		const rawData = requireUncached(
// 			path.join(pluginPath, 'plugins', pluginName, fileName)
// 		)
// 		// const pluginFile = JSON.parse(rawData)
// 		return rawData
// 	} catch (e) {
// 		return undefined
// 	}
// }
