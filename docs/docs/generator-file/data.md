# Data

The data section of the generator config is where you can take the data from the prompts a user answered and use it to generate new data. If you need to fetch a certain piece of data based on a users input you can do so in this section. It is also where you would perform any other data transformations or generaration before its passed to the actions section.

## How to define

This section can be defined in the generator config only as a function (can be async) that returns an object representing the data you want to make availiable in the subsiquent sections.

> The data object that you return will be passed to the actions section as the [`data`](./generator-instance#data) property.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 data() {
  return {/* any data */}
 },
} as GeneratorConfig

export = new Generator(config)
```

## Helper methods

The prompts section of a generator has access to some helper functions through the `this` keyword that make it super easy to create prompts.

### `add()`

This is a convinience method to add something to the data object without having to return it. It takes one argument, an object with a string key and any type of value, and injects the appends the object to the larger data object at runtime.

```typescript
const config = { 
 data() {
  this.add({
   packageManager: 'npm'
  })
 return {
  age: 5
 }
 },
}
// the resulting data object: { packageManager: 'npm', age: 5 }
```

### get `data`

Access the data object as it stands at any time in the data method

### set `data`

overwrite the data object at any point in the prompt runtime
