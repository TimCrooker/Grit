import fs from 'fs'
import move from 'move-file'
import { promisify } from 'util'

export { ensureDir, remove, outputFile } from 'majo'

export const pathExists = async (path: string): Promise<boolean> => {
	try {
		await promisify(fs.access)(path)
		return true
	} catch (e) {
		return false
	}
}

export const readDir = async (path: string): Promise<string[]> => {
	try {
		return await promisify(fs.readdir)(path)
	} catch (e) {
		return []
	}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requireUncached = (module: any): any => {
	delete require.cache[require.resolve(module)]
	return require(module)
}

const readFile = fs.promises.readFile

export { move, readFile }
