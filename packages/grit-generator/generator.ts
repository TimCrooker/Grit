import { Generator, GeneratorConfig } from 'gritenv'
import path from 'path'
import validate from 'validate-npm-package-name'

const config = { 
	prompts(grit) {
      this.input({
        name: 'name',
        message: 'What is the name of the project',
        default: path.basename(grit.outDir),
        filter: val => val.toLowerCase(),
				validate: (input) => {
					if(!validate(input).validForNewPackages) return 'Invalid npm package name'
					return true
				}
      }),
      this.input({
        name: 'description',
        message: 'How would you describe the project',
        default: `my awesome new project`,
      }),
			this.confirm({
				plugin: true,
				name: 'pluginTemplate',
				message: 'Would you like to use plugins in the new generator?',
				default: true,
			})
      this.input({
        name: 'username',
        message: 'What is your GitHub username',
        default: grit.gitUser.username || grit.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      }),
      this.input({
        name: 'email',
        message: 'What is your email?',
        default: grit.gitUser.email,
        store: true
      }),
      this.input({
        name: 'website',
        message: 'The URL of your website',
        default(answers) {
          return `github.com/${answers.username}`
        },
        store: true
      })
  },
  actions() {
    this.add({
      files: '**',
			transformExclude: ['template/**']
    }),
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