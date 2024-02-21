import { getGitUser } from './'
import fs from 'fs'
import os from 'os'
import path from 'path'

jest.mock('fs')
jest.mock('os')
jest.mock('path')

describe('getGitUser', () => {
	beforeEach(() => {
		// Reset modules and mock implementations before each test
		jest.resetModules()
		jest.clearAllMocks()
	})

	it('returns mock user when mock is true', () => {
		const user = getGitUser(true)
		expect(user).toEqual({
			name: 'MOCK_NAME',
			username: 'MOCK_USERNAME',
			email: 'mock@example.com',
		})
	})

	it('returns empty user if .gitconfig does not exist', () => {
		;(fs.existsSync as jest.Mock).mockReturnValue(false)
		const user = getGitUser()
		expect(user).toEqual({
			name: '',
			username: '',
			email: '',
		})
	})

	it('returns user from .gitconfig if file exists', () => {
		;(fs.existsSync as jest.Mock)
			.mockReturnValue(true)(fs.readFileSync as jest.Mock)
			.mockReturnValue(
				`
      [user]
        name = Test User
        email = test@example.com
        username = testuser
    `.trim()
			)(os.homedir as jest.Mock)
			.mockReturnValue('/mock/home')(path.join as jest.Mock)
			.mockReturnValue('/mock/home/.gitconfig')

		const user = getGitUser()
		expect(user).toEqual({
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
		})
	})
})
