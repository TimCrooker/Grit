# projen-generator

A generator for easily scaffolding out a new Grit generator.

## Features

- Bare minimal generator
- Typescript generator transpiling
- Ready to publish to NPM
- Unit test with [JEST](https://jestjs.io)

## Usage

Install [Grit](https://github.com/TimCrooker/Grit) first.

```bash
yarn global add grit-cli
# or
npm i -g grit-cli
```

### From npm

```bash
grit generator grit-<generatorName>
```

### From repo

```bash
grit TimCrooker/projen-generator grit-<generatorName>
```

## License

MIT.
