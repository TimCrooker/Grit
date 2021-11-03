import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'node',
	modulePathIgnorePatterns: ['dist'],
}
export default config
