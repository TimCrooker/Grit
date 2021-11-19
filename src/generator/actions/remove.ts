import { logger } from '@/logger'
import { remove } from '@/utils/files'
import { getGlobPatterns } from '@/utils/glob'
import { glob } from 'majo'
import { ActionFn } from './runActions'

/** */
export interface RemoveAction {
	type: 'remove'
	files: string | string[] | { [k: string]: string | boolean }
	when: boolean | string
}

export const removeAction: ActionFn<RemoveAction> = async (context, action) => {
	let patterns: string[] = []

	if (typeof action.files === 'string') {
		patterns = [action.files]
	} else if (Array.isArray(action.files)) {
		patterns = action.files
	} else if (typeof action.files === 'object') {
		patterns = getGlobPatterns(action.files, context.data)
	}
	const files = await glob(patterns, {
		cwd: context.opts.outDir,
		absolute: true,
		onlyFiles: false,
	})
	await Promise.all(
		files.map((file) => {
			logger.fileAction('red', 'Removed', file)
			return remove(file)
		})
	)
}
