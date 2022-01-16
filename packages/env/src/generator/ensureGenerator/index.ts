import { store } from '@/store'
import { colors } from 'swaglog'
import { pathExists } from 'youtill'
import { ParsedGenerator } from '../parseGenerator'

/*********************TYPES**********************/

/** Check that the generator exists where it should be and download it if it doesn't */
const ensureGenerator = async (generator: ParsedGenerator): Promise<void> => {
	const exists = await pathExists(generator.path)

	// if the generator already exists and no update is requested, we are done here
	if (exists) return

	// if the generator is local but it doesnt exist throw an error
	if (generator.type === 'local') {
		if (!exists) {
			throw new Error(
				`Directory ${colors.underline(generator.path)} does not exist`
			)
		}
		return
	}

	// if the generator still does not exist then add it to the store
	if (!exists) {
		await store.generators.add(generator)
	}
}

/*********************TYPES**********************/

export { ensureGenerator }
