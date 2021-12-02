import { parseGenerator } from '@/utils/parseGenerator'
import { getGenerator, loadGeneratorGrit } from '.'

describe('Name of the group', () => {
	it('should load npm generator versioned instance', async () => {
		const parsedGenerator = parseGenerator('generator')

		const generator = await loadGeneratorGrit(parsedGenerator)

		const grit = new generator({
			config: {},
			generator: parsedGenerator,
			mock: true,
		})

		expect(grit).toBeDefined()
	})

	it('should load instantiated generator', async () => {
		const grit = await getGenerator({ generator: 'generator', mock: true })

		expect(grit).toBeDefined()
	})
})
