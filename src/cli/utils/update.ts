import { ParsedGenerator } from '@/cli/parseGenerator'
import { store } from '@/store'
import { readFileSync } from 'fs'
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

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const pkg: Package = JSON.parse(
		readFileSync(path.join(generator.path, 'package.json'), 'utf8')
	)

	const update = await checkPkgForUpdates(pkg)

	if (update) {
		store.generators.set(generator.hash + '.update', update)
	}
}
