# Prompts

The prompts section is where you define the questions that the user will see and answer. The answers to the questions you ask the user will be available through the rest of the generators runtime sections.

## How to define

This section can be defined in the generator config in 2 different ways depending on your use case and preference. Either as either an object containing an array of prompt objects, or a function (can be async) that returns an array of prompts.

### As an object

Defining your prompts as an object makes it quick and easy to define prompts for more simplistic generator use cases.

> Note that the prompt object contains a single array which itself contains all of the prompts.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 prompts: {
  [/*insert-prompt-objects*/]
 },
} as GeneratorConfig

export = new Generator(config)
```

### As a function

Defining the prompts section as a function allows for much more dynamic and complex prompting logic. This is the preferred way to define prompts for most use cases.

The the only constraints of the prompts function is that the return value must be an array of prompt objects.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 prompts() {
  return [/*insert-prompt-objects*/]
 },
} as GeneratorConfig

export = new Generator(config)
```

If you opt for this section to be a function, then you have access to methods that make it even easier to add prompts to the generator that we will address later.

## What is a prompt?

A prompt is an object that contains information used to get input from the user that can be used to alter the output of the generator

### Structure

A  single prompt is always defined by a single object. Each prompt object has unique properties specific to the data type it works with but all prompts have a few data fields in common.

Prompts must always be defined with the type, name and message

#### Type

This field identifies the type of prompt you are defining. Each prompt type has a different set of properties and a different output data type.

- Input => string
- Number => number
- Confirm => Boolean
- List => Array of strings
- Checkbox => Array of strings
- Password => string

## Prompt Types

There are multiple prompt types availiable to you for obtaining different data types users of the generator.

### Input

The input prompt is a pretty basic prompt type. It is used to obtain string input from the user.

#### Basic example 

This example will ask the user for their name and allow them to enter a string value in response.

```typescript
{
 type: 'input',
 name: 'name',
 message: 'What is your name?'
}
```

### Confirm

### List

### Checkbox

### Password

### Number
  