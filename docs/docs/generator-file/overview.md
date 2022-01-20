# Overview

The generator file is the brains of the generator and is responsible for controlling all file and data manipulations. The generator file is a Javascript or Typescript file that exports an instance of the generator class instantiated with the generator config. The generator config is an object containing all of the generator logic and gives you tons of options for building out your generator. if you don't include a generator file, Grit will simply copy the contents of the template directory into the output directory.

While there will always be those who are scared of typescript, or prefer not to use it, typescript is vital for the generator file as it allows IDE type checking to ensure you impliment features and methods correctly. It will save hours of referencing the docs and allow you to be confident that Grit is working properly. For the most part you don't need to care about typescript anyways since all transpilation is handled for you and you dont need to explicitly type things if you dont want to.

## Valid Generator file names

- grit.config.ts
- grit.config.js
- generator.ts
- generator.js

## Generator Sections

There are 6 main sections that make up a generator config. They are run in sequence and all have specific purposes. All sections are optional and can be left out completely if you dont need their functionality.

1. [Prepare](./prepare) - Function executed before the generator runs
2. [Prompts](./prompts) - Create a list of prompts for the user to answer
3. [Data](./data) - Take answers from the user and use them to create more custom data to be used later
4. [Plugins](./plugins) - Configure plugins to be used by the generator
5. [Actions](./actions) - Define the actions that the generator will perform
6. [Completed](./completed) - Function executed after the generator has completed

## Generator Config

The below examples are all valid generator files, but they will do nothing on execution since all of the methods are empty

### Javascript

```javascript
//grit.config.js
const { Generator } = require('gritenv')

const config = {
 prepare() {},
 prompts() {},
 data() {},
 plugins: {},
 actions() {},
 completed() {},
}

module.exports = new Generator(config)
```

### Typescript

```typescript
//grit.config.ts
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 prepare() {},
 prompts() {},
 data() {},
 plugins: {},
 actions() {},
 completed() {}
} as GeneratorConfig

export = new Generator(config)
```

### Grit Context

When declaring methods inside the generator config, you will have access to a set of methods and properties provided by both `this` and via the Grit context class passed to the methods directly. This allows you

#### `this`

Each method that you declare functionally will have access to a set of properties and methods specific to that particular method. For example after you declare the `prompts` method, the `this` keyword will give you access to convinience functions for creating new prompts faster.

> This example creates a new input prompt without having to return anything from the prompts method. Its a simpler way to create prompts provided by the `this` keyword.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 prompts() {
  this.input({
   name: 'name',
   message: 'What is your name?',
  })
 },
} as GeneratorConfig

export = new Generator(config)
```

Not all methods have helper functions through `this`. Prepare and Completed do not have any specific use cases that require this functionality.

> To see the items provided through `this` for a config method, visit the doc for that method.

#### [Context](./generator-instance)

Other than accessing method specific properties throught the `this` keyword, you can also access the Grit runtime environment directly. This context is passed to each functional generator config method providing a set of more general purpose methods and the data collected from the user.

Examples of items provided through the Grit context would be the answers object, data returned from the data section, methods for running scripts and working with git, and much more that you can explore in the [generator instance](./generator-instance) documentation where you will see all things accessible through this context.

> This example shows how you can access and use the Grit runtime environment directly through the passed `context` prop

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 prompts(context) {
 // using the `this` keyword from earlier
  this.input({
  name: 'name',
  message: "What's the name of your project?",
  // Takes the output path from context as a default for this prompt
  default: path.basename(context.outDir),
  })
 },

 async completed(context) {
  context.gitInit() // initialization of a git repo
  await context.npmInstall() // install npm dependencies
 }
} as GeneratorConfig

export = new Generator(config)
```
