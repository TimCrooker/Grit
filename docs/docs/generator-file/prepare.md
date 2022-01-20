# Prepare

The prepare section is where you can perform any setup or initialization that is required before the generator is run. This is useful for preparing directories, performing api calls to fetch data, injecting answers into the generator, or really whatever you need to do before the generator runs.

## How to Define

This section is always defined as a function (can be async) and should not return anything

### Javascript

```javascript
//grit.config.js
const { Generator } = require('gritenv')

const config = {
 prepare() {},
}

module.exports = new Generator(config)
```

### Typescript

```typescript
//grit.config.ts
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 async prepare() {}, // supports async functions
} as GeneratorConfig

export = new Generator(config)
```
