import { GeneratorConfig, Generator } from 'gritenv'
import path from 'path'

const config = {
	prepare(grit) {

	},
	prompts(grit) {
		this.list({
			name: 'usage',
			message: 'How would you like to use eslint?',
			choices: [
				{
					name: 'Use eslint-loader',
					value: 'eslint-loader'
				},
				{
					name: 'Use eslint-plugin-react',
					value: 'eslint-plugin-react'
				}
			]
		})
		this.input({
			name: 'description',
			message: 'How would you describe the project',
			default: 'my awesome new grit-generator'
		})
		this.input({
			name: 'username',
			message: 'What is your GitHub username',
			default: grit.gitUser.username || grit.gitUser.name,
			filter: val => val.toLowerCase(),
			store: true
		})
		this.input({
			name: 'email',
			message: 'What is your email?',
			default: grit.gitUser.email,
			store: true
		})
		this.input({
			name: 'website',
			message: 'The URL of your website',
			default(answers) {
				return `github.com/${answers.username}`
			},
			store: true
		})
	},
	plugins: {
		mergeFiles: []
	},
	actions() {
		this.add({
			files: '**',
		})
		this.move({
			patterns: {
				gitignore: '.gitignore',
				'_package.json': 'package.json'
			}
		})
	},
	async completed(grit) {
		grit.gitInit()
		await grit.npmInstall()
		grit.showProjectTips()
	}
} as GeneratorConfig

export = new Generator(config)