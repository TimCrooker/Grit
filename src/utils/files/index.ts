import fs from 'fs'
import move from 'move-file'
import { promisify } from 'util'

export { ensureDir, remove, outputFile } from 'majo'

/**
 * Files
 */

export const IsFile = async (path: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(path)).isFile()
	} catch (e) {
		return false
	}
}

export const IsFileSync = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isFile()
	} catch (e) {
		return false
	}
}

/**
 * Paths
 */

/** Check if a path is valid and exists */
export const pathExists = async (path: string): Promise<boolean> => {
	try {
		await promisify(fs.access)(path)
		return true
	} catch (e) {
		return false
	}
}

/**
 * Directories
 */

export const readDir = async (path: string): Promise<string[]> => {
	try {
		return await promisify(fs.readdir)(path)
	} catch (e) {
		return []
	}
}

export const IsDirectory = async (path: string): Promise<boolean> => {
	try {
		return (await promisify(fs.lstat)(path)).isDirectory()
	} catch (e) {
		return false
	}
}

export const IsDirectorySync = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isDirectory()
	} catch (e) {
		return false
	}
}

/**
 *  MISC
 */

export const requireUncached = (module: any): any => {
	delete require.cache[require.resolve(module)]
	return require(module)
}

const readFile = fs.promises.readFile

export { move, readFile }
