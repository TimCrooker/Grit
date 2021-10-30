import os from 'os'
import { parseGenerator, ParsedGenerator } from './'

const parse = (name: string): ParsedGenerator => {
	const result = parseGenerator(name)
	return {
		...result,
		path: result.path
			.replace(os.homedir(), '~')
			// Replace back slashes with slashes (for Windows)
			.replace(/\\/g, '/'),
	}
}

describe('Parse generators', () => {
	it('GitHub repo', () => {
		const result = parse(`egoist/poi`)
		expect(result).toMatchInlineSnapshot(`
      Object {
        "hash": "304d7880",
        "path": "~/.Projenerator/V2/repos/304d7880",
        "prefix": "github",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "github:egoist",
        "version": "master",
      }
    `)
	})

	it('GitHub repo with version', () => {
		expect(parse(`egoist/poi#v1.0.0`)).toMatchInlineSnapshot(`
      Object {
        "hash": "6dc936fa",
        "path": "~/.Projenerator/V2/repos/6dc936fa",
        "prefix": "github",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "github:egoist",
        "version": "v1.0.0",
      }
    `)
	})

	it('Npm package', () => {
		expect(parse(`nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "d8ff0db4",
        "name": "npm",
        "path": "~/.Projenerator/V2/packages/d8ff0db4/node_modules/npm",
        "slug": "npm",
        "subGenerator": "sao-nm",
        "type": "npm",
        "version": "latest",
      }
    `)
	})

	it('Npm package with version', () => {
		expect(parse(`nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "d8ff0db4",
        "name": "npm",
        "path": "~/.Projenerator/V2/packages/d8ff0db4/node_modules/npm",
        "slug": "npm",
        "subGenerator": "sao-nm@2.0.1",
        "type": "npm",
        "version": "latest",
      }
    `)
	})
	it('Scoped Npm package', () => {
		expect(parse(`@egoist/nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "d8ff0db4",
        "name": "npm",
        "path": "~/.Projenerator/V2/packages/d8ff0db4/node_modules/npm",
        "slug": "npm",
        "subGenerator": "@egoist/sao-nm",
        "type": "npm",
        "version": "latest",
      }
    `)
	})
	it('Scoped Npm package with version', () => {
		expect(parse(`@egoist/nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "d8ff0db4",
        "name": "npm",
        "path": "~/.Projenerator/V2/packages/d8ff0db4/node_modules/npm",
        "slug": "npm",
        "subGenerator": "@egoist/sao-nm@2.0.1",
        "type": "npm",
        "version": "latest",
      }
    `)
	})
	it('prefix', () => {
		expect(parse(`gitlab:egoist/poi`)).toMatchInlineSnapshot(`
      Object {
        "hash": "23df4f54",
        "path": "~/.Projenerator/V2/repos/23df4f54",
        "prefix": "gitlab",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "gitlab:egoist",
        "version": "master",
      }
    `)
	})
	it('Remove sao- pefix', () => {
		expect(parse(`sao-nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "d8ff0db4",
        "name": "npm",
        "path": "~/.Projenerator/V2/packages/d8ff0db4/node_modules/npm",
        "slug": "npm",
        "subGenerator": "sao-nm",
        "type": "npm",
        "version": "latest",
      }
    `)
	})
})
