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
 prompts() { // can also be desclared as async
  return [/*insert-prompt-objects*/]
 },
} as GeneratorConfig

export = new Generator(config)
```

If you opt for this section to be a function, then you have access to methods that make it even easier to add prompts to the generator that we will address later.

## Working with answers

### Where to retrieve answers

Prompts are created with the purpose of collecting answers from the user but that leaves the question of how to access these answers later. While the prompts section of the generator config is dedicated to creating prompts, many of the later sections in the runtime will want to work with these answers to alter the output of the genrator. This is done via the [`answers` object](./generator-instance#answers) available through the Grit context.

### How to use answers

Now that you can reference the answers object from the Grit context, it is pretty easy to access an answer for a specific prompt. The answers object is simply a set of key value pairs where the key is the [`name`](#name) of the prompt, and the value is the answer returned from the prompt. As you are about to discover, depending on the type of prompt used, the answer to it will vary in data type. This will need to be considered when referenecing your answers in subsiquent sections of the generator.

## What is a prompt?

A prompt is an object that contains information used to get input from the user that can be used to alter the output of the generator

### Structure

A  single prompt is always defined by a single object. Each prompt object has unique properties specific to the data type it works with but all prompts have a few data fields in common.

Prompts must **always** be defined with the type, name and message but may have many more properties specific to the prompt type. All prompt types come with the following properties:

#### type

*Required*
This field identifies the type of prompt you are defining. Each prompt type has a different set of properties and a different returned data type as follows:

- Input => string
- Number => number
- Confirm => Boolean
- List => string
- Checkbox => Array of strings
- Password => string

#### name

*Required string*
The name field is used to identify this prompt in the answers object. This should be unique across all prompts in the generator.

#### message

*Required string*
The message field will be the actual message displayed to the user for that prompt.

#### default

*Optional*
This field will provide a default value for this prompt. The type of this value will depend on the type of prompt. To see what data type a prompt requires then scroll down to the specific prompt type.

#### when

*Optional boolean/(answers) => boolean*
This field is used to determine when the prompt should be displayed. If the when field evaluates to false, then the prompt will not be displayed.

When declaring this as a function, it will be provided the answers object representing all of the answers up to this point as a parameter and must return a boolean value.

#### store

*Optional boolean (default: false)*
This field allows you to design some extra convinience into your generators. Setting store to `true` will store the answer to the prompt that the user provides on their local machine. The next time they run the generator, they will see the previously stored answer as the default.

## Prompt Types

There are multiple prompt types availiable to you for obtaining different data types users of the generator.

### Input

The input prompt is a pretty basic prompt type. It is used to obtain string input from the user.

> This example will ask the user for their name and allow them to enter a string value in response.

```typescript
{
 type: 'input',
 name: 'name',
 message: 'What is your name?',
 default: 'John Doe' // string default
}
```

#### Additional Fields

##### validate

*Optional (userAnswer: string, answers) => boolean|string*
This field allows you to determine if the input from a user is valid or not. It is always defined as a function that returns a boolean or a string value. Returning a boolean will simply reject the input from the user and make them try again. Providing a string however will display that string as an error message informing them of the issue with their input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

##### filter

*Optional (userAnswer: string, answers) => string*
This field allows you to alter the input from the user. It is always defined as a function that returns a string value. The returned string value will be used as the answer to the prompt rather than the users exact input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

### Confirm

The confirm prompt is nice for quickly obtaining yes/no answers from users. It will be saved as a boolean value.

> This example will ask the user if they want to install a generator (y/n).

```typescript
{
 type: 'confirm',
 name: 'generator',
 message: 'Do you want to install a generator?',
 default: 'true' // boolean default
}
```

#### Additional Fields

##### plugin

*Optional boolean (default: false)*
This field will use the answer to this prompt to directly decide if a plugin of the same name should be included in the generation. If you plan on using a confirm prompt for this, then you need to ensure that the `name` field of the prompt matches the name of the plugin you are targetting. To learn more about plugins and how they work, visit the [plugin docs](./plugins).

### Number

The number prompt is another pretty basic prompt type. It is used to obtain number input from the user rather than string.

> This example will ask the user for their age and allow them to enter a number value in response.

```typescript
{
 type: 'number',
 name: 'age',
 message: 'How old are you?',
 default: 30 // number default
}
```
  
#### Additional Fields

##### validate

*Optional (userAnswer: number, answers) => boolean|string*
This field allows you to determine if the input from a user is valid or not. It is always defined as a function that returns a boolean or a string value. Returning a boolean will simply reject the input from the user and make them try again. Providing a string however will display that string as an error message informing them of the issue with their input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

##### filter

*Optional (userAnswer: number, answers) => number*
This field allows you to alter the input from the user. It is defined as a function that returns a number value. The returned string value will be used as the answer to the prompt rather than the users exact input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

### List

The List prompt type is great for allowing a user to an option from a list of choices. Think of this like a multiple choice question. The response value to this prompt will be single string representing the value of the selected choice.

> This example will ask the user to pick their favorite fruit from the list of fruits.

```typescript
{
 type: 'list',
 name: 'favFruit',
 message: 'What is your favorite fruit?',
 default: 'apple' // string default
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

#### Additional Fields

##### choices

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

##### plugin

*Optional boolean (default: false)*
This field will use the answer to this prompt to directly decide if a plugin of the same name should be included in the generation. If you plan on using a list prompt for this, then you need to ensure that the `value` field of the choice object matches the name of the plugin you are targeting. To learn more about plugins and how they work, visit the [plugin docs](./plugins).

##### filter

*Optional (userAnswer: string, answers) => string*
This field allows you to alter the input from the user. It is defined as a function that returns a string value. The returned string value will be used as the answer to the prompt rather than the users exact input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

##### loop

*Optional boolean (default: true)*
This field allows you to control the bahavior for especially long lists of choices. When set to true, the choices will loop forever as you scroll down the list. When set to false, the list will stop scrolling when you reach the end.

### Checkbox

The Checkbox prompt type is great for allowing a user to select any number of items from a list. The response value to this prompt will be an array of strings representing all of the selected choices' values.

 > This example will ask the user to select any number of items from the list.

 ```typescript
 {
  type: 'checkbox',
  name: 'name',
  message: 'Select all of your favorite Grit commands?',
 default: ['install', 'update'] // array of strings default
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

#### Additional Fields

##### choices

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

##### plugin

*Optional boolean (default: false)*
This field will use the answer to this prompt to directly decide if plugins should be included in the generation. This is usefule for enabling multiple plugins from a sinlge prompt. If you plan on using a checkbox prompt for this, then you need to ensure that the `value` field of the choice objects match the name of the plugins you are targeting. To learn more about plugins and how they work, visit the [plugin docs](./plugins).

##### validate

*Optional (userAnswer: [string], answers) => boolean|string*
This field allows you to determine if the input from a user is valid or not. It is always defined as a function that returns a boolean or a string value. Returning a boolean will simply reject the input from the user and make them try again. Providing a string however will display that string as an error message informing them of the issue with their input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

##### filter

*Optional (userAnswer: [string], answers) => [string]*
This field allows you to alter the input from the user. It is defined as a function that returns a string value. The returned string value will be used as the answer to the prompt rather than the users exact input.

You are provided 2 parameters for this function. The first will always be the answer that the user provided, and the second will be the answers object representing the answers to all prompts before this one.

## Helper methods

The prompts section of a generator has access to some helper functions through the `this` keyword that make it super easy to create prompts.

### `input()`

This is a convinience method to create an input prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.input({
   name: 'name',
   message: 'What is your name?'
  })
 },
}
```

### `password()`

This is a convinience method to create a password prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.password({
   name: 'password',
   message: 'Re-enter your password'
  })
 },
}
```

### `number()`

This is a convinience method to create a number prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.number({
   name: 'age',
   message: 'How old are you?'
  })
 },
}
```

### `confirm()`

This is a convinience method to create a confirm prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.confirm({
   name: 'confirm',
   message: 'Do you love Grit?',
  default: true
  })
 },
}
```

### `checkbox()`

This is a convinience method to create a checkbox prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.checkbox({
   name: 'checkbox',
   message: 'Select all the reasons you love Grit',
  choices: [
   {
    name: 'Because it is awesome',
    value: 'awesome'
   },
   {
    name: 'Because it is fast',
    value: 'fast'
   }
  ]
  })
 },
}
```

### `list()`

This is a convinience method to create a list prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
const config = { 
 prompts() {
  this.list({
   name: 'list',
   message: 'Pick one reason you love Grit?',
  choices: [
   {
    name: 'Because it is awesome',
    value: 'awesome'
   },
   {
    name: 'Because it is fast',
    value: 'fast'
   }
  ]
  })
 },
}
```

### get `prompts`

Access the array of prompt objects at any time

### get `answers`

Access the answers objects at any time

### set `answers`

overwrite the answers object at any point in the prompt runtime
