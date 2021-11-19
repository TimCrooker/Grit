import { logger } from '@/logger'
import { move } from '@/utils/files'
import { glob } from 'majo'
import path from 'path'
import { ActionFn } from './runActions'

/**  */
export interface MoveAction {
	type: 'move'
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
