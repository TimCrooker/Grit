import path from 'path'
import { globalRequire, pathExists } from '.'

describe('Path exists', () => {
	it('Path should exist', async () => {
		const filePath = path.resolve(__dirname, 'fixtures', 'foo.txt')
		expect(await pathExists(filePath)).toBeTruthy()
	})

	it('Path should not exist', async () => {
		const filePath = path.resolve(__dirname, 'socks')
		expect(await pathExists(filePath)).toBeFalsy()
	})
})

let test: any
describe('Global Require', () => {
	beforeAll(async () => {
		test = await globalRequire(
			path.resolve(__dirname, 'fixtures', 'globalRequire', 'index.ts')
		)
	})

	it('should execute isolated pure function', async () => {
		expect(test.test2(2)).toBe(2)
	})

	it('should populate second typescript file', () => {
		expect(test.test()).toBe('second')
	})

	it('should populate second file plus inject prop', () => {
		expect(test.test3()).toEqual({
			hello: 'world',
		})
	})
})
