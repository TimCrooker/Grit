import { PACKAGES_CACHE_PATH } from '@/config'
import { GritError } from '@/error'
import { logger } from '@/logger'
import { spinner } from '@/spinner'
import { store } from '@/store'
import { installPackages } from '@/utils/cmd'
import { outputFile, pathExists } from '@/utils/files'
import path from 'path'
import { downloadRepoFromGenerator } from './downloadRepo'
import { NpmGenerator, ParsedGenerator, RepoGenerator } from '../parseGenerator'
import { hasConfig } from '../generatorConfig'

/** Install an NPM generator to the grit store */
export const installNpmGenerator = async (
	generator: NpmGenerator
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

	logger.debug('Installing generator at path', installPath)

	// download the generator with npm install
	await installPackages({
		cwd: installPath,
		packages: [`${generator.name}@${generator.version}`],
		installArgs: ['--silent'],
	})
	logger.success('Generator installed')

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const packageJson = require(packagePath)

	// in the store, add the generator and insert the true version
	store.generators
		.add(generator)
		.set(
			generator.hash + '.version',
			packageJson.dependencies[generator.name].replace(/^\^/, '')
		)
}

/** Install a repo generator to the grit store */
export const installRepoGenerator = async (
	generator: RepoGenerator,
	clone?: boolean
): Promise<void> => {
	// Download repo
	spinner.start('Downloading Repo')
	try {
		await downloadRepoFromGenerator(generator, {
			clone,
			outDir: generator.path,
		})
		spinner.stop()
		logger.success('Downloaded repo')
	} catch (error) {
		let message = error.message
		if (error.host && error.path) {
			message += '\n' + error.host + error.path
		}
		throw new GritError(message)
	}

	// Only try to install dependencies for real generator
	const hasConfigFile = hasConfig(generator.path)
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
