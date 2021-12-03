/* eslint-disable @typescript-eslint/no-var-requires */
import { PACKAGES_CACHE_PATH } from '@/config'
import { logger } from '@/logger'
import { spinner } from '@/spinner'
import { store } from '@/store'
import { installPackages } from '@/utils/cmd'
import { outputFile, pathExists, requireUncached } from '@/utils/files'
import path from 'path'
import { downloadRepoFromGenerator } from './downloadRepo'
import {
	NpmGenerator,
	ParsedGenerator,
	RepoGenerator,
} from '../../../utils/parseGenerator'
import { hasGeneratorConfig } from '../getGenerator'

/** Install an NPM generator to the grit store */
export const installNpmGenerator = async (
	generator: NpmGenerator,
	update = false
): Promise<void> => {
	const installPath = path.join(PACKAGES_CACHE_PATH, generator.hash)
	const packagePath = path.join(installPath, 'package.json')

	// write a package.json file in the store
	await outputFile(
		packagePath,
		JSON.stringify({
			private: true,
		}),
		'utf8'
	)

	// download the generator with npm install
	logger.debug(
		update ? 'Updating' : 'Installing',
		'generator at path',
		installPath
	)
	await installPackages({
		cwd: installPath,
		packages: [
			`${generator.name}@${
				update || !generator.version ? 'latest' : generator.version
			}`,
		],
		installArgs: ['--silent'],
	})
	logger.success('Generator installed')

	// grab the new generator pakcage.json file
	const packageJson = requireUncached(packagePath)

	// in the store, add the generator and insert the true version
	store.generators
		.add(generator)
		.set(
			generator.hash + '.version',
			packageJson.dependencies[generator.name].replace(/^\^/, '')
		)
		.set(generator.hash + '.update', undefined)
}

/** Install a repo generator to the grit store */
export const installRepoGenerator = async (
	generator: RepoGenerator,
	clone?: boolean
): Promise<void> => {
	// Download repo
	spinner.start('Downloading Repo')

	await downloadRepoFromGenerator(generator, {
		clone,
		outDir: generator.path,
	})
	spinner.stop()
	logger.success('Downloaded repo')

	// Only try to install dependencies for real generator
	const hasConfigFile = hasGeneratorConfig(generator.path)
	const hasPackageJson = pathExists(path.join(generator.path, 'package.json'))
	if (hasConfigFile && hasPackageJson) {
		await installPackages({
			cwd: generator.path,
			installArgs: ['--production', '--silent'],
		})
	}

	// in the store, add the generator
	store.generators.add(generator)
}

/** Install a generator to the grit store */
export const installGenerator = async (
	generator: ParsedGenerator
): Promise<void> => {
	if (generator.type === 'npm') {
		return await installNpmGenerator(generator as NpmGenerator)
	} else if (generator.type === 'repo') {
		return await installRepoGenerator(generator as RepoGenerator)
	}
}
