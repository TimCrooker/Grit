import { readFileSync } from 'fs'
import path from 'path'
import updateNotifier, { Package, UpdateInfo } from 'update-notifier'
import { ParsedGenerator } from '../generator/parseGenerator'
import { logger } from '../logger'

export function checkPkgForUpdates(pkg: Package): UpdateInfo | undefined {
	const { update } = updateNotifier({ pkg })
	logger.debug('update info', update)
	return update
}

export function checkGeneratorForUpdates(
	generator: ParsedGenerator
): UpdateInfo | undefined {
	if (generator.type !== 'npm') return

	const { path: genPath } = generator

	const pkg: Package = JSON.parse(
		readFileSync(path.join(genPath, 'package.json'), 'utf8')
	)

	logger.debug('package info', pkg)

	return checkPkgForUpdates(pkg)
}
