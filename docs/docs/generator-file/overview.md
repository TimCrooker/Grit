# Overview

The generator file is the brains of the generator and is responsible for controlling all file and data manipulations. The generator file is a Javascript or Typescript file that exports an instance of the generator class instantiated with the generator config. The generator config is an object containing all of the generator logic and gives you tons of options for building out your generator. if you don't include a generator file, Grit will simply copy the contents of the template directory into the output directory.

##

While there will always be those who are scared of typescript, or prefer not to use it, typescript is vital for the generator file as it allows IDE type checking to ensure you impliment features and methods correctly. It will save hours of referencing the docs and allow you to be confident that Grit is working properly. For the most part you don't need to care about typescript anyways since all transpilation is handled for you and you dont need to explicitly type things if you dont want to.

## Valid Generator file names

- grit.config.ts
- grit.config.js
- generator.ts
- generator.js

## Generator Sections

There are 6 main sections that make up a generator config. They are run in sequence and all have specific purposes. All sections are optional and can be left out completely if you dont need their functionality.

1. [Prepare](./prepare)
2. [Prompts](./prompts)
3. [Data](./data)
4. [Plugins](./plugins)
5. [Actions](./actions)
6. [Completed](./completed)

## Empty example

The below examples are all valid generator files, but they will do nothing on execution since the config methods are all empty

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
 actions() {},
 completed() {}
} as GeneratorConfig

export = new Generator(config)
```
