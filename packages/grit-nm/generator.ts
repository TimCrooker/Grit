import path from 'path'
import { Generator, GeneratorConfig } from 'gritenv'
import validate from 'validate-npm-package-name'

const config = {
	prepare(grit) {
		const pkg = grit.pkg || {}

		if (pkg) {
			grit.logger.warn('Package.json already exists in the output directory')
		}
	},
	prompts(grit) {
		this.input({
			name: 'name',
			message: 'Package name',
			default: path.basename(grit.outDir),
			filter: (val) => val.toLowerCase(),
			validate: (input) => {
				if (!validate(input).validForNewPackages)
					return 'Invalid npm package name'
				return true
			},
		})

		this.input({
			name: 'description',
			message: 'Description',
			default: `my awesome new node package`,
		})

		this.input({
			name: 'keywords',
			message: 'What keywords describe your project? (space separated list)',
			validate: (input) => {
				// ensure there are no duplicate keywords
				const keywords = input.split(' ')
				const unique = [...new Set(keywords)]
				if (keywords.length !== unique.length)
					return 'Duplicate keywords are not allowed'
				return true
			},
		})

		this.input({
			name: 'username',
			message: 'What is your GitHub username',
			default: grit.gitUser.username || grit.gitUser.name,
			filter: (val) => val.toLowerCase(),
			store: true,
		})

		this.input({
			name: 'email',
			message: 'What is your email?',
			default: grit.gitUser.email,
			store: true,
		})

		this.input({
			name: 'website',
			message: 'The URL of your website',
			default(answers) {
				return `github.com/${answers.username}`
			},
			store: true,
		})

		this.confirm({
			plugin: true,
			name: 'typescript',
			message: 'TypeScript?',
			default: false,
		})

		this.confirm({
			plugin: true,
			name: 'boilerplate',
			message: 'Add boilerplate files?',
			default: false,
		})

		this.confirm({
			plugin: true,
			name: 'cli',
			message: 'Add CLI files?',
			default: false,
		})

		this.confirm({
			plugin: true,
			name: 'jest',
			message: 'Testing with jest?',
			default: true,
		})

		this.confirm({
			plugin: true,
			name: 'eslint',
			message: 'Eslint?',
			default: true,
		})

		this.confirm({
			plugin: true,
			name: 'license',
			message: 'Include license file?',
			default: true,
		})

		this.confirm({
			plugin: true,
			name: 'readme',
			message: 'Include readme file?',
			default: true,
		})
	},
	plugins: {
		mergeFiles: [],
	},
	actions(grit) {
		this.add({
			files: '**',
		})
		this.move({
			patterns: {
				gitignore: '.gitignore',
				'_package.json': 'package.json',
			},
		})

		// turn keywords into array of string values
		if (grit.answers.keywords && typeof grit.answers.keywords === 'string') {
		}

		this.extendJSON('package.json', {
			name: grit.answers.name,
			version: '0.0.0',
			description: grit.answers.description,
			homepage: grit.answers.website,
			author: {
				name: grit.answers.username,
				email: grit.answers.email,
				url: grit.answers.website,
			},
			repository: {
				type: 'git',
				url: 'github.com/' + grit.answers.username + '/' + grit.answers.name,
			},
			files: [],
			main: '',
			keywords: grit.answers.keywords
				.split(' ')
				.map((keyword: string) => keyword.trim()),
			devDependencies: {},
		})

		// add author to package.json
		if (grit.answers.username && grit.answers.email && grit.answers.website) {
			this.extendJSON('package.json', {})
		}

		// add repo url to package.json
		if (grit.answers.name && grit.answers.username) {
			this.extendJSON('package.json', {
				repository: {
					url: `${grit.answers.website}/${grit.answers.name}`,
				},
			})
		}

		// add license to package.json
		if (grit.answers.license) {
			this.extendJSON('package.json', {
				license: 'MIT',
			})
		}
	},
	async completed(grit) {
		grit.gitInit()
		await grit.npmInstall()
		grit.showProjectTips()
	},
} as GeneratorConfig

export = new Generator(config)
