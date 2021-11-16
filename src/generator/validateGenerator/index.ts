import { PACKAGES_CACHE_PATH } from '../../config'
import { GritError } from '../../error'
import { installPackages } from '../../utils/cmd'
import { downloadRepoFromGenerator } from '../downloadRepo'
import { pathExists, outputFile } from '../../utils/files'
import { logger, colors } from '../../logger'
import { spinner } from '../../spinner'
import path from 'path'
import {
	RepoGenerator,
	LocalGenerator,
	NpmGenerator,
	ParsedGenerator,
} from '../parseGenerator'
import { hasConfig } from '../generator-config'
import { store } from '..'

/**
 * Ensure that a generator is availiable at the specified path.
 *
 * In most cases this is used for `repo` generators
 */
async function ensureRepo(
	generator: RepoGenerator,
	{
		update,
		clone,
		registry,
	}: { update?: boolean; clone?: boolean; registry?: string }
): Promise<void> {
	// Check for the generator in the cache
	if (!update && (await pathExists(generator.path))) {
		return
	}

	// Download repo
	spinner.start('Downloading repo')
	try {
		await downloadRepoFromGenerator(generator, {
			clone,
			outDir: generator.path,
		})
		spinner.stop()
		logger.success('Downloaded repo')
	} catch (err) {
		let message = err.message
		if (err.host && err.path) {
			message += '\n' + err.host + err.path
		}
		throw new GritError(message)
	}

	// Only try to install dependencies for real generator
	const hasConfigFile = hasConfig(generator.path)
	const hasPackageJson = pathExists(path.join(generator.path, 'package.json'))

	if (hasConfigFile && hasPackageJson) {
		await installPackages({
			cwd: generator.path,
			registry,
			installArgs: ['--production'],
		})
	}
}

async function ensureLocal(generator: LocalGenerator): Promise<void> {
	const exists = await pathExists(generator.path)

	if (!exists) {
		throw new GritError(
			`Directory ${colors.underline(generator.path)} does not exist`
		)
	}
}

async function ensurePackage(
	generator: NpmGenerator,
	{ update, registry }: { update?: boolean; registry?: string }
): Promise<void> {
	const installPath = path.join(PACKAGES_CACHE_PATH, generator.hash)

	if (update || !(await pathExists(generator.path))) {
		const packagePath = path.join(installPath, 'package.json')
		await outputFile(
			packagePath,
			JSON.stringify({
				private: true,
			}),
			'utf8'
		)
		logger.debug('Installing generator at', installPath)
		await installPackages({
			cwd: installPath,
			registry,
			packages: [`${generator.name}@${generator.version || 'latest'}`],
		})

		// update the version in the cache
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const packageJson = require(packagePath)
		store.generators.set(
			generator.hash + '.version',
			packageJson.dependencies[generator.name].replace(/^\^/, '')
		)
	}
}

/** Check that the generator exists where it should be and download it if it isnt */
export const ensureGeneratorExists = async (
	generator: ParsedGenerator,
	{
		update,
		clone,
		registry,
	}: { update?: boolean; clone?: boolean; registry?: string }
): Promise<void> => {
	if (generator.type === 'repo') {
		await ensureRepo(generator, {
			update,
			clone,
			registry,
		})
	} else if (generator.type === 'npm') {
		await ensurePackage(generator, { update, registry })
	} else if (generator.type === 'local') {
		await ensureLocal(generator)
	}
}
