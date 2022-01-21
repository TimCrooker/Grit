# Generator Context

The generator instance is availiable in methods of the generator file passed as a context parameter which gives you access to all of the following properties and methods.

## Properties

### `answers`

The answers to prompts. Cannot be accessing inside of `prompts` in the generator.

- Type: `{[k: string]: any | undefined}`

### `data`

A merged object combining the answers and any data returned from the [data method](generator-file/data) of generator

- Type: `{[k: string]: any | undefined}`

### `pkg`

Read the contents of the `package.json` file from the output directory. Will return undefined if it does not exist

- Type: `{[k: string]: any | undefined}`

### `generatorPkg`

Read the contents of the `package.json` file from the generator itself. Will return undefined if it does not exist

- Type: `{[k: string]: any | undefined}`

### `gritPkg`

Read the contents of the `package.json` file from Grit

- Type: `{[k: string]: any}`

### `gitUser`

The machines global git user config

- Type: `{name: string, username: string, email: string}`

### `projectName`

The basename of the output directory

- Type: `string`

### `templateDirPath`

The path to the generators template directory.

- Type: `string`

### `outDir`

The absolute path to the output directory

- Type: `string`

### `npmClient`

The users npm client

- Type: `npm | yarn`

### `logger`

The logger instance for logging messages to the user with useful features

- Type: [Ora](https://github.com/TimCrooker/swaglog)

see the [Swaglog docs](https://github.com/TimCrooker/swaglog) to learn more about using the logger (its super simple)

### `spinner`

The spinner instance

- Type: [Ora](https://github.com/sindresorhus/ora)

## Methods

### `gitInit()`

Run `git init` in the output directory

- Type: `() => void`

### `async gitCommit()`

Run `git Commit -m '[message]'` in the output directory

- Type: `(commitMessage?: string) => Promise<void>`

### `async npmInstall()`

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

### `async runScript()`

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

### `showProjectTips()`

Show the user a success message

- Type: `() => void`

### `createError()`

Throw errors more elegantly with better logging of the error stack

- Type: `(message: string) => GritError`

## Testing Methods

These methods are meant for use in testing environments to assert against the generators output but can also be used in the generator config if you would like.

### `async getOutputFiles()`

Get a list of the files in the output directory

- Type: `() => Promise<string[]>`

### `async hasOutputFile()`

Check if a specific file exists in the output directory

- Type: `(file: string) => Promise<boolean>`

### `async readOutputFile()`

Get the stringified content of a specific file in the output directory

- Type: `(file: string) => Promise<string>`
