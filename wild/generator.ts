import path from "path"
import { GeneratorConfig } from "grit-cli"

export = {
  prompts() {
    return [
      {
        name: 'name',
				type: 'input',
        message: 'What is the name of the new project',
        default: `${path.basename(this.outDir)}`,
        filter: val => val.toLowerCase(),
      },
      {
        name: 'description',
				type: 'input',
        message: 'How would you describe the new template',
        default: `my awesome NEW generator`
      },
      {
        name: 'username',
				type: 'input',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
				type: 'input',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        name: 'website',
				type: 'input',
        message: 'The URL of your website',
        default(data) {
          return `github.com/${data.answers.username}`
        },
        store: true
      }
    ]
  },
  actions: [
    {
      type: 'add',
      files: '**'
    },
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore',
				'_package.json': 'package.json'
      }
    }
  ],
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
} as GeneratorConfig