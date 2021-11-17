import type { Config } from '@jest/types'
import hq from 'alias-hq'

const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'node',
	modulePathIgnorePatterns: ['dist'],
	moduleNameMapper: hq.get('jest'),
}

export default config
