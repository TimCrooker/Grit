import { logger } from '@/logger'
import { move } from '@/utils/files'
import { glob } from 'majo'
import path from 'path'
import { ActionFn } from '../runActions/runActions'

/**
 * Move and rename files
 */
export interface MoveAction {
	type: 'move'
	/**
	 *	Patterns object represents the filepath conversions
	 *
	 *	key is the relative filePath to be transformed
	 *
	 *	value is the new relative filePath
	 *
	 *	Move file: {'oldDir/file.js': 'newDir/file.js'}
	 *
	 *	Rename file: {'oldFile.js': 'newFile.js'}
	 */
	patterns: {
		[k: string]: string
	}
}

export const moveAction: ActionFn<MoveAction> = async (context, action) => {
	await Promise.all(
		Object.keys(action.patterns).map(async (pattern) => {
			const files = await glob(pattern, {
				cwd: context.opts.outDir,
				absolute: true,
				onlyFiles: false,
			})
			if (files.length > 1) {
				throw new Error('"move" pattern can only match one file!')
			} else if (files.length === 1) {
				const from = files[0]
				const to = path.join(context.opts.outDir, action.patterns[pattern])
				await move(from, to, {
					overwrite: true,
				})
				logger.fileMoveAction(from, to)
			}
		})
	)
}
