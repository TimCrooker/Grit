import path from 'path'
import { SAO } from '../../src/index'

test('use default saofile', async () => {
	const sao = new SAO({
		generator: path.join(__dirname, 'fixtures'),
		mock: true,
	})

	await sao.run()

	expect(await sao.getOutputFiles()).toMatchInlineSnapshot()
	expect(await sao.readOutputFile('foo.txt')).toBe('foo\n')
})
