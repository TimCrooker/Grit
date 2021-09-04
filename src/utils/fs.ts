import fs, { promises as fsP } from 'fs'
import move from 'move-file'
import path from 'path'

export { ensureDir, remove, outputFile } from 'majo'

export const pathExists = async (path: string): Promise<boolean> => {
	try {
		await fs.promises.access(path)
		return true
	} catch (_) {
		return false
	}
}

export const copy = async (
	sourcePath: string,
	destinationPath: string,
	{ overwrite = true, directoryMode } = {}
): Promise<void> => {
	if (!sourcePath || !destinationPath) {
		throw new TypeError('`sourcePath` and `destinationPath` required')
	}

	if (!overwrite && (await pathExists(destinationPath))) {
		throw new Error(`The destination file exists: ${destinationPath}`)
	}

	await fsP.mkdir(path.dirname(destinationPath), {
		recursive: true,
		mode: directoryMode,
	})

	try {
		await fsP.rename(sourcePath, destinationPath)
	} catch (error) {
		if (error.code === 'EXDEV') {
			await fsP.copyFile(sourcePath, destinationPath)
			await fsP.unlink(sourcePath)
		} else {
			throw error
		}
	}
}

export { move }

export const readFile = fs.promises.readFile
