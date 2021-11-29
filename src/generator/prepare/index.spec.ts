import { Grit } from '@/index'
import path from 'path'

const grit = new Grit({
	generator: path.join(__dirname, 'fixtures'),
	mock: true,
})

describe('Prepare sections', () => {
	it('should execute the prepare section of the generator file', async () => {
		await grit.run()
		expect(grit.answers).toEqual({ name: 'Tim' })
	})
})
