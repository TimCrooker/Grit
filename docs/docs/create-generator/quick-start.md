---
sidebar_position: 1
---

# Quick Start

## Scaffold out a new generator

If you wish to dive right in

## Generator Structure

This is the file structure of your new generator

```
📦grit-example
┣ 📂template
 ┃ ┣ 📜gitignore
 ┃ ┣ 📜LICENSE
 ┃ ┗ 📜README.md
 ┣ 📂test
 ┃ ┣ 📂__snapshots__
 ┃ ┃ ┗ 📜test.ts.snap
 ┃ ┗ 📜test.ts
 ┣ 📜.gitignore
 ┣ 📜babel.config.js
 ┣ 📜generator.ts
 ┣ 📜jest.config.js
 ┣ 📜LICENSE
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜tsconfig.json
 ┗ 📜yarn.lock
 ```

The `template` directory houses the files that grit will scaffold out when you run it.

> Transpile the typescript `generator.ts` file into `generator.js`

```bash
npm run build
# compiles the `generator.ts` file into generator.js
yarn build
# To run script with yarn use this instead
```

> Run the generator

```bash
grit ./ ../grit-example-output
```

Here you see the file structure of the output matches the contents of the template directory since we are not performing any other actions

```
 ┣ 📜.gitignore
 ┣ 📜LICENSE
 ┗ 📜README.md
 ```

### Example

> This is the generator.ts file that we created above with grit-generator

```typescript
import { Generator, GeneratorConfig } from 'gritenv'
import path from 'path'

const config = { 
 prompts(grit) {
      this.input({
        name: 'name',
        message: 'What is the name of the project',
        default: path.basename(grit.outDir),
        filter: val => val.toLowerCase(),
      })
      this.input({
        name: 'description',
        message: 'How would you describe the project',
        default: `my awesome new grit-generator`
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
```

This example demonstrates a few key concepts that are required for creating generators. You see the main export has a three main items

#### prompts

The prompts function you see above returns an array of 5 prompt objects.
