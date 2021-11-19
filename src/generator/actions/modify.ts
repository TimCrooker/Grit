import { logger } from '@/logger'
import { majo } from 'majo'
import path from 'path'
import { ActionFn } from './runActions'

/**  */
export interface ModifyAction {
	/** Identify this action as the modify type */
	type: 'modify'
	/** Glob patterns to identify items inside of the project directory */
	files: string | string[]
	/**  */
	handler: (data: any, filepath: string) => any
}

export const modifyAction: ActionFn<ModifyAction> = async (context, action) => {
	const stream = majo()
	stream.source(action.files, { baseDir: context.opts.outDir })
	stream.use(async ({ files }) => {
		await Promise.all(
			// eslint-disable-next-line array-callback-return
			Object.keys(files).map(async (relativePath) => {
				const isJson = relativePath.endsWith('.json')
				let contents = stream.fileContents(relativePath)
				if (isJson) {
					contents = JSON.parse(contents)
				}
				let result = await action.handler(contents, relativePath)
				if (isJson) {
					result = JSON.stringify(result, null, 2)
				}
				stream.writeContents(relativePath, result)
				logger.fileAction(
					'yellow',
					'Modified',
					path.join(context.opts.outDir, relativePath)
				)
			})
		)
	})
	await stream.dest(context.opts.outDir)
}
