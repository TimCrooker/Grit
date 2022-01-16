import { requireUncached } from 'youtill'
import { ParsedGenerator, store } from 'gritenv'
import path from 'path'
import updateNotifier, { Package, UpdateInfo } from 'update-notifier'

export const checkPkgForUpdates = async (
	pkg: Package
): Promise<UpdateInfo | undefined> => {
	const notifier = updateNotifier({ pkg })
	const update = await notifier.fetchInfo()
	return update.type !== 'latest' ? update : undefined
}

export const checkGeneratorForUpdates = async (
	generator: ParsedGenerator
): Promise<void> => {
	if (generator.type !== 'npm') return

	const pkg: Package = requireUncached(
		path.join(generator.path, 'package.json')
	)

	const update = await checkPkgForUpdates(pkg)

	if (update) {
		store.generators.set(generator.hash + '.update', update)
	}
}
