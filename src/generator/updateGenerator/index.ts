import { installNpmGenerator, installRepoGenerator } from '../installGenerator'
import { ParsedGenerator, NpmGenerator, RepoGenerator } from '../parseGenerator'

export const updateGenerator = async (
	generator: ParsedGenerator
): Promise<void> => {
	if (generator.type === 'npm') {
		return await installNpmGenerator(generator as NpmGenerator)
	} else if (generator.type === 'repo') {
		return await installRepoGenerator(generator as RepoGenerator)
	}
}
