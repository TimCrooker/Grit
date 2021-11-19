import { logger } from '@/logger'
import { move } from '@/utils/files'
import { glob } from 'majo'
import path from 'path'
import { ActionFn } from './runActions'

/** */
export interface CopyAction {
	type: 'copy'
	patterns: {
		[k: string]: string
	}
}

export const copyAction: ActionFn<CopyAction> = async (context, action) => {
	await Promise.all(
		Object.keys(action.patterns).map(async (pattern) => {
			const files = await glob(pattern, {
				cwd: context.opts.outDir,
				absolute: true,
				onlyFiles: false,
			})
			if (files.length > 1) {
				throw new Error('"copy" pattern can only match one file!')
			} else if (files.length === 1) {
				const from = files[0]
				const to = path.join(context.opts.outDir, action.patterns[pattern])
				await move(from, to, {
					overwrite: false,
				})
				logger.fileMoveAction(from, to)
			}
		})
	)
}
