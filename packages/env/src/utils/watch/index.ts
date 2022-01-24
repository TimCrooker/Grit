/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'stream'
import { pathExists } from 'youtill'

/**
 * watches supplied directories for changes and executes a function passing in the path to that file
 *
 * @param directories arrray of directory paths to watch for changes
 */
export const watchDirectories = async (
	directories: string[],
	watchSubdirectories = true,
	e: EventEmitter
): Promise<void> => {
	for (const directory of directories) {
		// Get absolute system path
		const trueDir = path.resolve(directory)

		//Check path exists
		if (!(await pathExists(trueDir))) continue

		let fsWait: any = false
		fs.watch(trueDir, { recursive: watchSubdirectories }, (event, filename) => {
			// 500ms delay between change detections
			if (filename && event === 'change') {
				if (fsWait) return
				fsWait = setTimeout(() => {
					fsWait = false
				}, 500)

				e.emit('Rebuild', trueDir, path.basename(filename))
			}
		})
	}
}
