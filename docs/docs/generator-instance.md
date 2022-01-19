---
sidebar_position: 4
---

# Generator Instance

The generator instance is availiable in methods of the generator file via the `this` keyword which gives you access to all of the following properties and methods.

## Properties

### answers

The answers to prompts. Cannot be accessing inside of `prompts` in the generator.

- Type: `{[k: string]: any | undefined}`

### data

A merged object combining the answers and any data returned from the [data method](generator-file/data) of the generator

- Type: `{[k: string]: any | undefined}`

### pkg

Read the contents of the `package.json` file from the output directory. Will return undefined if it does not exist

- Type: `{[k: string]: any | undefined}`

### gitUser

The machines global git user config

- Type: `{name: string, username: string, email: string}`

### outDirName

The basename of the output directory

- Type: `string`

### outDir

The absolute path to the output directory

- Type: `string`

### npmClient

The users npm client

- Type: `npm | yarn`

### logger

The logger instance for logging messages to the user with useful featureSvg

- Type: [Logger](logger.md)

### spinner

The spinner instance

- Type: [Ora](https://github.com/sindresorhus/ora)

## Methods

### gitInit

Run `git init` in the output directory synchronously

- Type: `() => void`

### gitCommit

Run `git Commit -m '[message]'` in the output directory

- Type: `(commitMessage?: string) => Promise<void>`

### npmInstall

Installs dependencies in the output directory with preferred npm client

- Type: `InstallPackages`

```typescript
type InstallPackages = (opts: InstallOptions) => Promise<{ code: number }>

interface InstallOptions {
 /** Install directory */
 cwd: string
 /** Package manager being used */
 npmClient?: NPM_CLIENT
 /** Package manager install CLI options */
 installArgs?: string[]
 /** Names of additional packages to install */
 packages?: string[]
 /** Run install as devDependencies */
 saveDev?: boolean
 registry?: string
}
```

### runScript

Runs an npm script in the output directories package.json file

- Type: `RunScript`

```typescript
type RunScript = (opts: RunNpmScriptOptions) => Promise<void>

interface RunNpmScriptOptions {
 /** the path to the directory commands will run in*/
 cwd?: string
 /** name of script from package.json to run */
 script: string
 /** Package manager being used */
 npmClient?: NPM_CLIENT
 /** Argunemets to be appended to the command line */
 args?: string[]
}
```

### showProjectTips

Show the user a success message

- Type: `() => void`

### createError

Throw errors more elegantly with better logging of the error stack

- Type: `(message: string) => GritError`

### getOutputFiles

Get a list of the files in the output directory

- Type: `() => Promise<string[]>`

### hasOutputFile

Check if a specific file exists in the output directory

- Type: `(file: string) => Promise<boolean>`

### readOutputFile

Get the stringified content of a specific file in the output directory

- Type: `(file: string) => Promise<string>`
