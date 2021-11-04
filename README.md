<h1 align="center">

<img src="https://i0.wp.com/www.primefaces.org/wp-content/uploads/2017/09/feature-react.png?ssl=1" width="224px"/>

</br>
Grit CLI
</h1>
<p align="center">A Simple Flexible and Powerful scaffolding tool built to help eliminate the need for boilerplate code

<p align="center">
<a href="https://github.com/TimCrooker/Grit/releases" target="_blank">
<img src="https://img.shields.io/github/package-json/v/TimCrooker/Grit?style=for-the-badge" alt="cli version" />
</a>
&nbsp;
<a href="https://www.npmjs.com/package/grit-cli" target="_blank">
<img src="https://img.shields.io/npm/dw/grit-cli?style=for-the-badge" alt="npm downloads" />
</a>
&nbsp;
<a href="https://www.npmjs.com/package/grit-cli" target="_blank">
<img src="https://img.shields.io/github/stars/TimCrooker/grit?style=for-the-badge" alt="github stars" />
</a>
&nbsp;
<img src="https://img.shields.io/circleci/build/github/TimCrooker/Grit/master?color=green&style=for-the-badge" alt="circle ci tests" />
&nbsp;
<img src="https://img.shields.io/npm/l/grit-cli?style=for-the-badge" alt="license" />
</h1>

## Overview

This tool is awesome. Write some more stuff here

## Quick start

### Install

The Grit CLI needs to be installed globally on your machine

```bash
# Install globally 
npm install -g grit-cli
```

### Run a generator

You now have global access to the `grit` command anywhere in your terminal.

```bash
grit [generator] [outDir]
```

| Argument    | Description                                                         | Default     | Required? |
| ----------- | ------------------------------------------------------------------- | ----------- | --------- |
| [generator] | The generator to run. Can be NPM package, github repo, or local dir | none        | no        |
| [outDir]    | Can be the name of the output directory or a path to it             | working dir | no        |

## Documentation

The best way to explore all the features of **Grit** is to read the project [Documentation](https://timcrooker.github.io/Grit/)

## Commands & Options

### `grit`

Use a generator to create a new project with the interactive console UI.

```bash
grit create [OPTION]
```

| Option | Description                                              | Type   | Default | Required? |
| ------ | -------------------------------------------------------- | ------ | ------- | --------- |
| `-t`   | Enables to define custom backend and frontend templates. | `bool` | `false` | No        |

## Featured generators

### Generators

- [generator](https://github.com/TimCrooker/grit-generator) - Generate an bare bones grit-generator
  - Unit tested
  - Typescript compatible
  - NPM ready

### Project add-ons

- [readme](https://github.com/TimCrooker/grit-readme) - Generate a well formatted README.md
- [release-it](https://github.com/TimCrooker/grit-release-it) - Add release-it to your project for automated version publishing
  - config file
  - github actions script
- [typescript](https://github.com/TimCrooker/grit-typescript) - Easily add typescript to your Project
  - Fully configured tsconfig.json files
  - Enabled rules follow best practices
- [eslint](https://github.com/TimCrooker/grit-eslint) - Add eslint to any project
  - Rules follow best practices
  - supports typescript projects
  - optional prettier integration for code formatting

## Project assistance

If you want to help out and/or support development of `Grit`:

- Add a [GitHub Star](https://github.com/TimCrooker/Grit) to the project.
- Submit a pull request on [GitHub](https://github.com/TimCrooker/Grit/pulls)
- Write interesting articles about project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or personal blog.

## License

`Grit` is free and open-source MIT licensed software.
