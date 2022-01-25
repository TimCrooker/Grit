import { GeneratorConfig } from 'grit-cli'
import path from 'path'

export = { 
	prompts(grit) {
      
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
    
    await grit.npmInstall()
  }
} as GeneratorConfig