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
- List => string
- Checkbox => Array of strings
- Password => string

## Prompt Types

There are multiple prompt types availiable to you for obtaining different data types users of the generator.

### Input

The input prompt is a pretty basic prompt type. It is used to obtain string input from the user.

> This example will ask the user for their name and allow them to enter a string value in response.

```typescript
{
 type: 'input',
 name: 'name',
 message: 'What is your name?'
}
```

### Confirm

The confirm prompt is nice for quickly obtaining yes/no answers from users. It will be saved as a boolean value.

> This example will ask the user if they want to install a generator (y/n).

```typescript
{
 type: 'confirm',
 name: 'generator',
 message: 'Do you want to install a generator?'
}
```

### List

The List prompt type is great for allowing a user to an option from a list of choices. Think of this like a multiple choice question. The response value to this prompt will be single string representing the value of the selected choice.

> This example will ask the user to pick their favorite fruit from the list of fruits.

```typescript
{
 type: 'list',
 name: 'favFruit',
 message: 'What is your favorite fruit?',
 choices: [
{ 
    name: 'Apple',
    value: 'apple'
   },
   { 
    name: 'Pineapple',
    value: 'pine'
   },
   { 
    name: 'Pizza',
    value: 'za'
   }
 ]
 // the returned value from selecting Pizza would be the string: za
}
```

#### List Choice

To create a list, you must define a choices array. This array is a list of Choice objects.

```typescript
{
 name: 'name',
 value: 'value',
 disabled: false
}
```

| Properties | Description                                          | Default | required |
| ---------- | ---------------------------------------------------- | ------- | -------- |
| name       | text that will be shown to the user                  | none    | true     |
| value      | the string value returned if this choice is selected | none    | true     |
| disabled   | does not show the choice to the user as an option    | false   | false    |

### Checkbox

The Checkbox prompt type is great for allowing a user to select any number of items from a list. The response value to this prompt will be an array of strings representing all of the selected choices' values.

 > This example will ask the user to select any number of items from the list.

 ```typescript
 {
  type: 'checkbox',
  name: 'name',
  message: 'Select all of your favorite Grit commands?'
  choices: [
   { 
    name: 'Grit Install',
    value: 'install'
   },
   { 
    name: 'Grit Update',
    value: 'update'
   },
   { 
    name: 'Grit Remove',
    value: 'remove'
   }
  ]
 }
 // The returned value from a user selecting all three would be ['install', 'update', 'remove']
 ```

 | Properties | Description                | Default | required |
 | ---------- | -------------------------- | ------- | -------- |
 | choices    | an array of choice objects | none    | true     |

#### Checkbox Choice

To create a Checkbox list, you must define a choices array. This array is a list of Choice objects.

```typescript
// Standalone choice object
{
 name: 'name',
 value: 'value', 
 checked: false 
}
```

| Properties | Description                                                               | Default | required |
| ---------- | ------------------------------------------------------------------------- | ------- | -------- |
| name       | text that will be shown to the user                                       | none    | true     |
| value      | the string value appened to the response array if this choice is selected | none    | true     |
| checked    | selects the choice to by default when its true                            | false   | false    |

### Number

The number prompt is another pretty basic prompt type. It is used to obtain number input from the user rather than string.

> This example will ask the user for their age and allow them to enter a number value in response.

```typescript
{
 type: 'number',
 name: 'age',
 message: 'How old are you?'
}
```
  