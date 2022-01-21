# Actions

The actions section is where you define the actions that the generator will perform after the data gathering phase of the generator is complete. These actions are simply abstracted ways of performing file and directory manipulations and are used to control the output of the generator.

## How to define

This section can be defined in the generator config in 2 different ways depending on your use case or preference. Either as an object containing an array of action objects, or a function that returns an array of action objects

### As an object

Defining your actions as an object makes it quick and easy to define actions for more simplistic generator use cases.

> Note that the actions object contains a single array which itself contains all of the prompts.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 actions: {
  [/*insert-action-objects*/]
 },
} as GeneratorConfig

export = new Generator(config)
```

### As a function

Defining the actions section as a function allows for much more dynamic and complex logic. This is the preferred way to define actions for most use cases.

The the only constraints of the actions function is that the return value must be an array of prompt objects.

```typescript
import { Generator, GeneratorConfig } from 'gritenv'

const config = { 
 actions() { // can also be desclared as async
  return [/*insert-action-objects*/]
 },
} as GeneratorConfig

export = new Generator(config)
```

> If you opt for this section to be a function, then you have access to methods that make it even easier to add actions to the generator that we will address later in the [helper methods](#helper-methods) section.

## What is an action?

An action is an object that defines a particular file manipulation task to be performed. Most of these are used to facilitate easily moving files from the template directory of the generator, to the output directory of the generator as defined by the user. There are

### Structure

A single action is always defined by a single object. Each action object type comes with unique properties to give you more control over how the action is performed

Actions must **always** be defined with the type field, but may have many more properties specific to the prompt type.

#### type

*Required*
This field identifies the type of action you are defining. Each action type has a different set of properties and a different file manipulation task:

- add - Add files from template directory to output directory
- copy - copy files from one location to another in the output directory
- move - move files from one location to another in the output directory
- modify - modify the contents of a file or files in the output directory
- remove - delete a file or files in the output directory

## Action Types

### Add

The add action is used to add files from a source location to an ouput location. Its default behavior is to add files from the generators template directory, to the output directory.

> This most basic example of an action will add all files from the template directory to the output directory.

```typescript
{
 type: 'add',
 files: '**',
}
```

#### Additional Fields

##### templateDir

*Optional string (default: generator template directory)*
This field is where the add action will source the files to add to the output directory.

##### files

*Required string | [string]*
This field is where you can specify criteria to select files from the template directory with. The selection process uses glob patterns and you can specify an array of glob patters to select a range of files. The most simple use case is to select all files using the '**' pattern.

##### transform

*Optional boolean (default: true)*
This field is used to control whether the files are transformed using EJS while they are being added. Setting this to false will not apply EJS preprocessing to the files so any EJS tags will be preserved as shown in the template file.

##### transformInclude

*Optional string | [string]*
This field is used to further control the transformation of files by specifying a subset of the files being moved should have EJS transformations applied. This uses minimatch patterns to match files

##### transformExclude

*Optional string | [string]*
This field is used to further control the transformation of files by specifying a subset of the files being moved should not have EJS transformations applied. This uses minimatch patterns to match files

##### data

*Optional Record<string, any> | (context) => Record<string, any>*
This field is again used to work with transformations. Using it, you can provide additional data to the EJS preprocessor. This can overwrite or alter the data provided for transformations for this specific add action. You also are provided with the [grit context](./generator-instance) argument if you declare it as a function, so you have access to needed properties.

### Copy

The copy action is used to duplicate files in the output directory. In addition to duplicating you can relocate the copied file, rename it, or both at the same time. All paths are assesed relative to the output directory.

> This basic example of the copy action will copy the file at `src/file.txt` and output a duplicate file in the `src/newDir` directory with the new name: `newFile.txt`.

```typescript
{
 type: 'copy',
 patterns: {
  {
  'src/file.txt': 'src/newDir/newFile.txt'
  }
 }
}
```

#### Additional Fields

##### patterns

*Required {Record<string, string>}*
This field is the method of selecting a copy source and destination for a file. The patterns object should consist of key value pairs where the key is the source and the value is the destination. All string path values are assesed relative to the output directory so this is intended to be used after adding files to the output directory. There can be any number of key value pairs in the patterns object.

##### overwrite

*Optional boolean (default: true)*
This field specifies if the copy action should overwrite existing files of the same name

### Move

This action is similar to the copy action but instead of duplicating the files, it moves the file. This is used for moving files and renameing them. Many use-cases for this action are stricly rename operations.

> This basic example of the move action will move the file from `src/file.txt` to `src/newDir` directory with the new name: `newFile.txt`.

```typescript
{
 type: 'move',
 patterns: {
  {
  'src/file.txt': 'src/newDir/newFile.txt'
  }
 }
}
```

#### Additional Fields

##### patterns

*Required {Record<string, string>}*
This field is the method of selecting a move source and destination for a file. The patterns object should consist of key value pairs where the key is the source path and the value is the destination path. All string path values are assesed relative to the output directory so this is intended to be used after adding files to the output directory. There can be any number of key value pairs in the patterns object.

##### overwrite

*Optional boolean (default: true)*
This field specifies if the move action should overwrite existing files of the same name

### Modify

 This action is used to modify the actual contents of a file. This method can add great flexibility to a generator by allowing any file to be modified, but its mostly useful for modifying JSON files. When this action detects that the source file is a json file, it will conver it to an object automatically so you can easily work with it.

> This basic example of the modify action takes the package.json file from the output directory, and changes the name field to `new-name`.

```typescript
{
 type: 'modify',
 files: 'package.json'
 handler: (data) => {
  data.name = 'new-name'
  return JSON.stringify(data)
 }
}
```

#### Additional Fields

##### files

*Required string | [string]*
This field is where you can specify criteria to select files from the ouptut directory. The selection process uses glob patterns to select a file.

##### handler

*Required (data, filepath) => any*
This field is where you specify the transformations for the file selected with the files field. The data argument passed to the function will be a stringified version of the file contents unless the file is a .json file in which case the data argument will be an object. The filepath argument will be the path to the file being transformed. The return value of the handler function should be the exact ouput you want to be injected into the file.

> Remember that while you may recieve a JSON object as an argument, you will still need to stringify it before writing it back to the file.

### Remove

The remove action is the most basic action. It will delete files or directories that you pass it from the generators ouput directory.

> This basic example of the remove action takes the file.txt file from the output directory, and deletes it.

```typescript
{
 type: 'remove',
 files: 'src/file.txt'
}
```

#### Additional Fields

##### files

*Required string | [string]*
This field is where you can specify criteria to select files from the ouptut directory. The selection process uses glob patterns to select a file.

## Helper methods

The prompts section of a generator has access to some helper functions through the `this` keyword that make it super easy to create prompts.

### `add()`

This is a convinience method to create an add action. It takes one argument, an add action object, and injects the prompt into the generator at runtime.

```typescript
 actions() {
  this.add({
   files: '**',
  })
 }
```

### `move()`

This is a convinience method to create a password prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
 actions() {
  this.move({
   patterns: {
    {'src/file.txt': 'src/newDir/newFile.txt'}
   }
  })
 }
```

### `copy()`

This is a convinience method to create a number prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
actions() {
  this.copy({
  patterns: {
    {'src/file.txt': 'src/newDir/newFile.txt'}
   }
 })
}
```

### `modify()`

This is a convinience method to create a confirm prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
actions() {
  this.modify({
   files: 'package.json'
   handler: (data) => {
    data.name = 'new-name'
    return JSON.stringify(data)
  }
 })
}
```

### `remove()`

This is a convinience method to create a checkbox prompt. It takes one argument, a prompt object, and injects the prompt into the generator at runtime.

```typescript
actions() {
  this.remove({
  files: 'src/file.txt'
 })
}
```

### `extendJSON()`

This is a convinience method to take a JSON file in the output directory and merge it with another object. It is an abstraction of the modify action that allows you to more easily work with JSON files. This function takes 3 arguments

#### filePath

*Required string*
This is the glob pattern to identify the JSON file you are targetting. It will be evaluated relative the output directory as is the default behavior of the modify action this function is based on.

#### toMerge

*Requried Record<string, any>*
This is the object being merged into the destination file

#### mergeArrays

*Optional boolean (default: false)*
the default behavior of the function will replace the existing array with a new one if they have the same key identifying them. If you set this to true, the function will merge the arrays together instead.

```typescript
actions() {
 const objectToMerge = {
  name: 'new-name',
  version: '1.0.0'
 }

 this.extendJSON('package.json', objectToMerge)
 )
}
```

### get `actions`

Access the array of prompt objects at any time
