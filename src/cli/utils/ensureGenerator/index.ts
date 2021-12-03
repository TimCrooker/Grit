import {
	RepoGenerator,
	LocalGenerator,
	NpmGenerator,
	ParsedGenerator,
} from '../../../utils/parseGenerator'
import { pathExists } from '@/utils/files'
import { GritError } from '@/error'
import { colors } from '@/logger'
import { installNpmGenerator, installRepoGenerator } from '../installGenerator'
import { store } from '@/store'

/** ensure repo generator is downloaded and ready to run */
async function ensureRepo(
	generator: RepoGenerator,
	clone?: boolean
): Promise<void> {
	await installRepoGenerator(generator, clone)
}

/** ensure NPM generator is downnloaded and ready to run */
async function ensurePackage(
	generator: NpmGenerator,
	update?: boolean
): Promise<void> {
	await installNpmGenerator(generator, update)
}

/** ensure local generator is ready to run */
async function ensureLocal(generator: LocalGenerator): Promise<void> {
	const exists = await pathExists(generator.path)

	store.generators.add(generator)

	if (!exists) {
		throw new GritError(
			`Directory ${colors.underline(generator.path)} does not exist`
		)
	}
}

/** Check that the generator exists where it should be and download it if it isnt */
export const ensureGeneratorExists = async (
	generator: ParsedGenerator,
	update?: boolean
): Promise<void> => {
	// if the generator already exists and no update is requested, we are done here
	if ((await pathExists(generator.path)) && !update) return

	if (generator.type === 'repo') {
		await ensureRepo(generator)
	} else if (generator.type === 'npm') {
		await ensurePackage(generator, update)
	} else if (generator.type === 'local') {
		await ensureLocal(generator)
	}
}
