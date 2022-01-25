import path from 'path'
import { getGenerator, Grit } from 'grit-cli'
import fs from 'fs'

const generator = path.join(__dirname, '..')

test('defaults', async () => {
	const grit = await getGenerator({
		generator,
		mock: true,
		answers: { 'npm-publish': true, 'github-release': true, 'git-push': true }
	})

	fs.mkdirSync(grit.outDir, { recursive: true })
	fs.writeFileSync(path.join(grit.outDir, 'package.json'), JSON.stringify({}))

  await grit.run()
	
	expect(await grit.getOutputFiles()).toMatchSnapshot()

	const packageFile = await grit.readOutputFile('package.json') as Record<string, any>
  expect(packageFile.devDependencies["release-it"]).toEqual("^14.11.8")
	expect(packageFile.scripts.release).toEqual("release-it")
	
	const releaseFile = await grit.readOutputFile('.release-it.json') as Record<string, any>
	expect(releaseFile.github).toBeDefined()
	expect(releaseFile.git).toBeDefined()
})
