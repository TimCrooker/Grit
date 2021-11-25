import { logger } from '@/logger'
import { getGlobPatterns } from '@/utils/glob'
import ejs from 'ejs'
import isBinaryPath from 'is-binary-path'
import { majo } from 'majo'
import matcher from 'micromatch'
import path from 'path'
import { DataFunction } from '../../../generatorConfig'
import { ActionFn } from '../../runAction'

/**  */
export interface AddAction {
	type: 'add'
	templateDir?: string
	files: string[] | string
	/**  */
	filters?: {
		[k: string]: string | boolean | null | undefined
	}
	/** Transform the template contents with ejs */
	transform?: boolean
	/**
	 * Only transform files matching given minimatch patterns
	 */
	transformInclude?: string | string[]
	/**
	 * Don't transform files matching given minimatch patterns
	 */
	transformExclude?: string | string[]
	/**
	 * Custom data to use in template transformation
	 */
	data?: DataFunction | object
}

export const addAction: ActionFn<AddAction> = async (
	context,
	action,
	config = {}
) => {
	const stream = majo()
	stream.source(['!**/node_modules/**'].concat(action.files), {
		baseDir: path.resolve(
			context.parsedGenerator.path,
			action.templateDir || config.templateDir || 'template'
		),
	})

	if (action.filters) {
		const excludedPatterns = getGlobPatterns(
			action.filters,
			context.answers,
			true
		)

		if (excludedPatterns.length > 0) {
			stream.use(() => {
				const excludedFiles = matcher(stream.fileList, excludedPatterns)
				for (const file of excludedFiles) {
					stream.deleteFile(file)
				}
			})
		}
	}

	const shouldTransform =
		typeof action.transform === 'boolean'
			? action.transform
			: config.transform !== false
	// use EJS to transform files with action.data variables availiable
	if (shouldTransform) {
		stream.use(({ files }) => {
			let fileList = Object.keys(stream.files)

			// Exclude binary path
			fileList = fileList.filter((fp) => !isBinaryPath(fp))

			// Change transform behavior
			if (action.transformInclude) {
				fileList = matcher(fileList, action.transformInclude)
			}
			if (action.transformExclude) {
				fileList = matcher.not(fileList, action.transformExclude)
			}

			fileList.forEach((relativePath) => {
				const contents = files[relativePath].contents.toString()

				const actionData =
					typeof action.data === 'object'
						? action.data
						: action.data && action.data.call(context, context)
				stream.writeContents(
					relativePath,
					ejs.render(
						contents,
						Object.assign({}, context.answers, actionData, {
							context: context,
						})
					)
				)
			})
		})
	}
	stream.onWrite = (_, targetPath): void => {
		logger.fileAction('magenta', 'Created', targetPath)
	}
	await stream.dest(context.opts.outDir)
}
