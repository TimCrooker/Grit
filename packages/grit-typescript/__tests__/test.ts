import path from 'path'
import { getGenerator } from 'gritenv'

const generator = path.join(__dirname, '..')

test('defaults', async () => {
	const grit = await getGenerator({
		generator,
		mock: true,
		answers: {
			name: 'test',
			description: 'test',
			username: 'test',
			email: 'test',
			website: 'test',
			jest: true,
		},
	})
	await grit.run()

	expect(await grit.getOutputFiles()).toMatchInlineSnapshot(`
    Array [
      ".gitignore",
      "LICENSE",
      "README.md",
      "__tests__/index.spec.ts",
      "babel.config.js",
      "jest.config.js",
      "package.json",
    ]
  `)
})
