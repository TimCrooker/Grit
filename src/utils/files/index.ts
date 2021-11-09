/* eslint-disable @typescript-eslint/no-use-before-define */
import fs from 'fs'
import { ensureDir, outputFile, remove } from 'majo'
import move from 'move-file'
import path from 'path'
import { promisify } from 'util'

/**
 * Files
 */

/** check if a path represents a file asynchronously */
export const isFile = async (path: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(path)).isFile()
	} catch (e) {
		return false
	}
}

/** check if a path represents a file syncronously */
export const isFileSync = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isFile()
	} catch (e) {
		return false
	}
}

/** strip the extension from a file name. Works on both paths and fileNames */
export const stripFileExtension = (name: string): string => {
	const basePath = path.basename(name)
	return basePath.replace(/\.[^/.]+$/, '')
}

// TODO impliment read file sync and async functions

export { outputFile }

/**
 * Paths
 */

/** Check if a path is valid and exists asynchronously */
export const pathExists = async (path: string): Promise<boolean> => {
	try {
		await promisify(fs.access)(path)
		return true
	} catch (e) {
		return false
	}
}

/** Check if a path is valid and exists asynchronously */
export const pathExistsSync = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isFile()
	} catch (e) {
		return false
	}
}

/**
 * Directories
 */

/** Get the names of all items in a directory asynchronously */
export const readDir = async (
	path: string,
	onlyFiles?: boolean,
	onlyDirectories?: boolean
): Promise<string[]> => {
	try {
		const contents = await promisify(fs.readdir)(path)

		if (onlyFiles) {
			return contents.filter(async (name) => await isFile(`${path}/${name}`))
		} else if (onlyDirectories) {
			return contents.filter(
				async (name) => await isDirectory(`${path}/${name}`)
			)
		}
		return contents
	} catch (e) {
		return []
	}
}

/** Get the names of all items in a directory asynchronously */
export const readDirSync = (
	path: string,
	onlyFiles?: boolean,
	onlyDirectories?: boolean
): string[] => {
	try {
		const contents = fs.readdirSync(path)

		if (onlyFiles) {
			return contents.filter((name) => isFileSync(`${path}/${name}`))
		} else if (onlyDirectories) {
			return contents.filter(async (name) => isDirectorySync(`${path}/${name}`))
		}
		return contents
	} catch (e) {
		return []
	}
}

/** Get the names of all items in a directory and all of its sub-directories asynchronously*/
export const readDirRecursive = async (
	path: string,
	filterFunction?: (name: string) => boolean
): Promise<(string | string[])[]> => {
	try {
		const files = []
		const directories = await readDir(path, true, false)
		for (const directory of directories) {
			const subFiles = await readDirRecursive(
				`${path}/${directory}`,
				filterFunction
			)
			files.push(
				...subFiles.filter((file) => {
					!Array.isArray(file) && filterFunction ? filterFunction(file) : true
				})
			)
		}
		return files
	} catch (e) {
		return []
	}
}

/** Get the names of all items in a directory and all of its sub-directories synchronously*/
export const readDirRecursiveSync = (
	path: string,
	filterFunction?: (name: string) => boolean
): (string | string[])[] => {
	try {
		const files = []
		const directories = readDirSync(path, true, false)
		for (const directory of directories) {
			const subFiles = readDirRecursiveSync(
				`${path}/${directory}`,
				filterFunction
			)
			files.push(
				...subFiles.filter((file) => {
					!Array.isArray(file) && filterFunction ? filterFunction(file) : true
				})
			)
		}
		return files
	} catch (e) {
		return []
	}
}

/** check if a path represents a directory asyncronously */
export const isDirectory = async (path: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(path)).isDirectory()
	} catch (e) {
		return false
	}
}

/** check if a path represents a directory syncronously */
export const isDirectorySync = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isDirectory()
	} catch (e) {
		return false
	}
}

// export const createDirecory = async (path: string): Promise<void> => {
// 	try {

// 	} catch (e) {

// 	}
// }

export { ensureDir }

/**
 *  MISC
 */

/** a require statement that will reload contents if they are changed during execution */
export const requireUncached = (module: any): any => {
	delete require.cache[require.resolve(module)]
	return require(module)
}

const readFile = fs.promises.readFile

export { move, readFile, remove }
