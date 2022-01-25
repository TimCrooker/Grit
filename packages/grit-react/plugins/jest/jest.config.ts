import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from './tsconfig.json'
import { jsWithTs as tsjPreset } from 'ts-jest/presets'
import type { Config } from '@jest/types'

const paths = compilerOptions.paths ? compilerOptions.paths : {}

const config: Config.InitialOptions = {
	rootDir: './src',
	transform: {
		...tsjPreset.transform,
	},
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress/',
		'<rootDir>/webdriverio/',
	],
	moduleNameMapper: {
		...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
	},
}
export default config
