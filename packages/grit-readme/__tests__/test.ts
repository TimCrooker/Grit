import path from 'path'
import { Grit } from 'grit-cli'

const generator = path.join(__dirname, '..')

test('defaults', async () => {
	const grit = new Grit({
		generator,
		mock: true
	})
  await grit.run()

  expect(await grit.getOutputFiles()).toMatchSnapshot()
})
