import path from 'path'
import { pathExists } from '.'

describe('File Utilities', () => {
	it('Path should exist', async () => {
		const filePath = path.resolve(__dirname, 'fixtures', 'foo.txt')
		expect(await pathExists(filePath)).toBeTruthy()
	})

	it('Path should not exist', async () => {
		const filePath = path.resolve(__dirname, 'socks')
		expect(await pathExists(filePath)).toBeFalsy()
	})
})
