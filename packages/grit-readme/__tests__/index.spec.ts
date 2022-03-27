import path from 'path'
import { getGenerator } from 'gritenv'

const generator = path.join(__dirname, '..')

test('defaults', async () => {
	const grit = await getGenerator({
		generator,
		mock: true,
	})
	await grit.run()

	expect(await grit.getOutputFiles()).toMatchInlineSnapshot(`
    Array [
      "README.md",
    ]
  `)
})
