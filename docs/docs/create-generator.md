---
sidebar_position: 3
---

# Create Generator

Grit provides a generator to make it super easy to build your own generator. 

```bash
grit generator grit-example
# replace `grit-example` with your desired generator name (must start with `grit-`)
```

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

## Understanding the Generator File

The `generator.ts` file is the most important part of a generator and controls all file and data manipulations. Removing this file will cause Grit to use a default generator.ts that simply copies the contents of the template directory into the output directory. While there will always be those who are scared of typescript, or prefer not to use it, typescript is vital for the generator file as it allows IDE type checking to ensure you impliment features and methods correctly. It will save hours of referencing the docs and allow you to be confident that Grit is working properly. For the most part you don't need to care about typescript anyways since all transpilation is handled for you and you dont need to explicitly type things if you dont want to.

### Example 

> This is the generator.ts file that we created above with grit-generator

```typescript
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
```

This example demonstrates a few key concepts that are required for creating generators. You see the main export has a three main items 

#### prompts



The prompts function you see above returns an array of 5 prompt objects. 