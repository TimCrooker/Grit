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
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		'<rootDir>/cypress/',
		'<rootDir>/webdriverio/',
	],
	moduleNameMapper: {
		...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
		// '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
	},
	setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
}
export default config
