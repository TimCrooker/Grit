import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'node',
	setupTestFrameworkScriptFile: './tests/setup.js',
}
export default config
