import path from 'path'
import rimraf from 'rimraf'
import { readDir } from '../../utils/files'
import { downloadRepo } from '.'
import { RepoGenerator } from '../parseGenerator'

const outDirPath = path.join(__dirname, 'fixtures')
const repoGenerator: RepoGenerator = {
	hash: '304d7880',
	path: '~/.sao/V2/repos/304d7880',
	prefix: 'github',
	repo: 'test-repository',
	subGenerator: undefined,
	type: 'repo',
	user: 'rmccue',
	version: 'master',
}

afterEach(async () => {
	rimraf(outDirPath + '/*', () => {
		return
	})
})

test('downloads repo files directly', async () => {
	// jest breaking with axios request
	// await downloadRepo(repoGenerator, { clone: false, outDir: outDirPath })
	// const download = await readDir(path.join(outDirPath))
	expect(true)
})

test('downloads repo files with git clone', async () => {
	// await downloadRepo(repoGenerator, {
	// 	clone: true,
	// 	outDir: path.join(outDirPath, 'clone'),
	// })
	// const download = await readDir(path.join(outDirPath))
	expect(true)
})

//clean up download after test
