import { Generator, GeneratorConfig } from 'gritenv'
import { App, Base, Docs, TestSetup } from 'plugins'

const config = {
	plugins: {
		mergeFiles: ['_tsconfig.json', 'meta.json'],
		ignores: [
			{
				plugin: ['css', 'scss', 'styled-components'],
				when: (answers): boolean => answers.ui !== 'none',
				pattern: ['src/components/**', 'src/pages/index.tsx'],
			},
			{
				when: (answers): boolean => answers.css_features !== 'css',
				pattern: ['**/*.css'],
			},
			{
				when: (answers): boolean => answers.css_features !== 'scss',
				pattern: ['**/*.s@(c|a)ss'],
			},
			{
				when: (answers): boolean => answers.features?.includes('storybook'),
				pattern: ['**/*.stories.tsx'],
			},
			{
				when: (answers): boolean => answers.testing === 'jest',
				pattern: ['**/src/**/*.(spec|test).(tsx)'],
			},
		],
		extend: {
			_app: {
				import: [],
				inner: [],
				wrapper: [],
			} as App,
			_docs: {
				import: [],
				inner: [],
				wrapper: [],
			} as Docs,
			testSetup: {
				import: [],
				inner: [],
				wrapper: [],
			} as TestSetup,
		},
	},
	prompts(grit) {
		this.input({
			name: 'name',
			message: "What's the name of your project?",
			default: grit.projectName,
		})
		this.list({
			name: 'pm',
			message: 'Choose your package manager?',
			choices: [
				{ name: 'npm', value: 'npm' },
				{ name: 'yarn', value: 'yarn' },
			],
			default: 'npm',
		})
		this.list({
			plugin: true,
			name: 'ui',
			message: 'UI framework:',
			choices: [
				{ name: 'None', value: 'none' },
				{ name: 'Tailwind CSS', value: 'tailwind' },
				{ name: 'Bootstrap', value: 'bootstrap' },
				// {name: 'Chakra UI', value: 'chakra-ui'},
				{ name: 'Antd', value: 'antd' },
			],
			default: 'none',
		})
		this.list({
			plugin: true,
			name: 'css_features',
			message: 'CSS Preprocessor:',
			choices: [
				{
					name: 'Just css (built-in support styled-jsx)',
					value: 'css',
				},
				{ name: 'sass/scss', value: 'scss' },
				{ name: 'styled-components', value: 'styled-components' },
			],
			default: 'css',
		})
		this.confirm({
			plugin: true,
			name: 'styled-system',
			message: 'Do you also want to add styled-system?',
			when: (answers) => answers.css_features === 'styled-components',
		})
		this.checkbox({
			plugin: true,
			name: 'features',
			message: 'Features:',
			choices: [
				// { name: 'Fetch (next.js built-in)', value: 'fetch' },
				{ name: 'Axios', value: 'axios' },
				{ name: 'Storybook', value: 'storybook' },
				{ name: 'SVGR', value: 'svgr' },
				{ name: 'Environment Variables', value: 'env' },
				// { name: 'Reverse Proxy', value: 'reverse-proxy' },
				// { name: 'Bundle Analyzer', value: 'bundle-analyzer' },
				{ name: 'Apollo GraphQL', value: 'apollo-graphql' },
				// { name: 'graphql-request', value: 'graphql-request' },
			],
		})
		this.list({
			plugin: true,
			name: 'state-management',
			message: 'State Management:',
			choices: [
				{ name: 'None', value: 'none' },
				{ name: 'Redux + Redux Toolkit', value: 'redux' },
				{ name: 'Apollo GraphQL', value: 'apollo-graphql' },
				// { name: 'Recoil', value: 'recoil' },
				// { name: 'MobX', value: 'mobx' },
				// { name: 'Zustand', value: 'zustand' },
			],
			default: 'none',
		})
		this.checkbox({
			plugin: true,
			name: 'linter',
			message: 'Linting:',
			choices: [
				{ name: 'ESlint', value: 'eslint' },
				{ name: 'StyleLint', value: 'stylelint' },
			],
			default: ['eslint'],
		})
		this.list({
			plugin: true,
			name: 'testing',
			message: 'Testing Framework:',
			choices: [
				{ name: 'Jest', value: 'jest' },
				{
					name: 'React Testing Library',
					value: 'testing-library',
				},
			],
			default: 'jest',
		})
		this.list({
			plugin: true,
			name: 'e2etest',
			message: 'E2E Testing framework:',
			choices: [
				{ name: 'None', value: 'none' },
				{ name: 'Cypress', value: 'cypress' },
			],
			default: 'none',
		})
		this.list({
			plugin: true,
			name: 'docker',
			message: 'Docker integration:',

			choices: [
				{ name: 'None', value: 'none' },
				{ name: 'Dockerfile', value: 'docker' },
			],
			default: 'docker',
		})
		this.list({
			plugin: true,
			name: 'CI',
			message: 'Continuous integration:',

			choices: [
				{ name: 'None', value: 'none' },
				{ name: 'GitHub Actions', value: 'github-actions' },
				// { message: 'Travis', name: 'travis' },
			],
			default: 'none',
		})
	},
	data(grit) {
		if ((grit.answers.pmRun = 'npm')) {
			this.add({ pmRun: 'npm run' })
		} else {
			this.add({ pmRun: 'yarn' })
		}
	},
	actions() {
		this.add({
			files: '**',
		})
		this.move({
			patterns: {
				gitignore: '.gitignore',
				'_package.json': 'package.json',
				'_tsconfig.json': 'tsconfig.json',
			},
		})
	},
	async completed(grit) {
		grit.gitInit()
		await grit.npmInstall({ npmClient: grit.answers.pm })
		grit.showProjectTips()
	},
} as GeneratorConfig<Base>

export = new Generator(config)
