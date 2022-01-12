/* eslint-disable @typescript-eslint/no-use-before-define */
import { writeFileSync } from 'fs'
import _ from 'lodash'
import path from 'path'
import { readFileSync } from '../files'

/**
 * Merge a list of objects into the base object
 *
 * @param base the base object that will be merged into
 * @param objects a list of objects to merge into the base
 */
export const mergeObjects = (
	base = {},
	objects: Array<Record<string, any>>,
	mergeArrays = true
): Record<string, any> => {
	function customizer(objValue: string | any[], srcValue: any): unknown {
		if (_.isArray(objValue)) {
			return objValue.concat(srcValue)
		}
	}

	return objects.reduce((acc, obj) => {
		return _.mergeWith(acc, obj, mergeArrays && customizer)
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
	filePaths: string[],
	mergeArrays?: boolean
): Record<string, any> => {
	// const files
	return mergeObjects(
		base,
		filePaths.map((file) => {
			try {
				return JSON.parse(readFileSync(file, 'utf8'))
			} catch (e) {
				return {}
			}
		}),
		mergeArrays
	)
}

/**
 * Merge a base object with a list of json files privided via string paths
 *
 * @param base the base object to be merged into
 * @param filePaths a list of paths to json files to merge into the base
 * @param outFile the path to the file the object should be written to (must end in .json)
 */
export const mergeJsonAndWrite = (
	base = {},
	filePaths: string[],
	outFile: string,
	mergeArrays?: boolean
): void => {
	if (path.extname(outFile) !== '.json')
		throw new Error('Expected `.json` extension for the outFile')

	const merged = mergeJsonFiles(base, filePaths, mergeArrays)

	writeFileSync(outFile, JSON.stringify(merged))
}
