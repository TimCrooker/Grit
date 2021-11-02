import {
	ParsedGenerator,
	parseGenerator,
	getGeneratorPrefix,
	inferGeneratorPrefix,
} from './'
import { COMMAND_NAME } from '../../config'
import os from 'os'

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
        "hash": "e66c30fe",
        "path": "~/.projenerator/V2/generators/repos/e66c30fe",
        "prefix": "github",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "egoist",
        "version": "master",
      }
    `)
	})

	it('GitHub repo with version', () => {
		expect(parse(`egoist/poi#v1.0.0`)).toMatchInlineSnapshot(`
      Object {
        "hash": "6e0c0844",
        "path": "~/.projenerator/V2/generators/repos/6e0c0844",
        "prefix": "github",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "egoist",
        "version": "v1.0.0",
      }
    `)
	})

	it('Npm package', () => {
		expect(parse(`nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "872c3bbe",
        "name": "projen-nm",
        "path": "~/.projenerator/V2/generators/packages/872c3bbe/node_modules/projen-nm",
        "slug": "projen-nm",
        "subGenerator": undefined,
        "type": "npm",
        "version": "latest",
      }
    `)
	})

	it('Npm package with version', () => {
		expect(parse(`nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "e89b3150",
        "name": "projen-nm",
        "path": "~/.projenerator/V2/generators/packages/e89b3150/node_modules/projen-nm",
        "slug": "projen-nm@2.0.1",
        "subGenerator": undefined,
        "type": "npm",
        "version": "2.0.1",
      }
    `)
	})
	it('Scoped Npm package', () => {
		expect(parse(`@egoist/nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "f048b5a2",
        "name": "@egoist/projen-nm",
        "path": "~/.projenerator/V2/generators/packages/f048b5a2/node_modules/@egoist/projen-nm",
        "slug": "@egoist/projen-nm",
        "subGenerator": undefined,
        "type": "npm",
        "version": "latest",
      }
    `)
	})
	it('Scoped Npm package with version', () => {
		expect(parse(`@egoist/nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "fbc5b034",
        "name": "@egoist/projen-nm",
        "path": "~/.projenerator/V2/generators/packages/fbc5b034/node_modules/@egoist/projen-nm",
        "slug": "@egoist/projen-nm@2.0.1",
        "subGenerator": undefined,
        "type": "npm",
        "version": "2.0.1",
      }
    `)
	})
	it('prefix', () => {
		expect(parse(`gitlab:egoist/poi`)).toMatchInlineSnapshot(`
      Object {
        "hash": "766eaa60",
        "path": "~/.projenerator/V2/generators/repos/766eaa60",
        "prefix": "gitlab",
        "repo": "poi",
        "subGenerator": undefined,
        "type": "repo",
        "user": "egoist",
        "version": "master",
      }
    `)
	})
	it('Remove sao- pefix', () => {
		expect(parse(`sao-nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "4ae792e6",
        "name": "projen-sao-nm",
        "path": "~/.projenerator/V2/generators/packages/4ae792e6/node_modules/projen-sao-nm",
        "slug": "projen-sao-nm",
        "subGenerator": undefined,
        "type": "npm",
        "version": "latest",
      }
    `)
	})
})

describe('Extract generator prefix', () => {
	it('gitlab', () => {
		expect(getGeneratorPrefix('gitlab:egoist/poi')).toBe('gitlab')
	})
	it('github', () => {
		expect(getGeneratorPrefix('github:egoist/poi')).toBe('github')
	})
	it('npm with version', () => {
		expect(getGeneratorPrefix('poi@2.0.1')).toBe('npm')
	})
	it('npm naked', () => {
		expect(getGeneratorPrefix('poi')).toBe('npm')
	})
	it('Extract generator prefix', () => {
		expect(getGeneratorPrefix('gitlab:egoist/poi')).toBe('gitlab')
	})
})

describe('Infer prefix from naked generator', () => {
	it('gitlab', () => {
		expect(inferGeneratorPrefix('gitlab:egoist/poi')).toBe('gitlab:egoist/poi')
	})

	it('naked github repo', () => {
		expect(inferGeneratorPrefix('egoist/poi')).toBe('github:egoist/poi')
	})

	it('naked npm', () => {
		expect(inferGeneratorPrefix('poi')).toBe(`npm:${COMMAND_NAME}-poi`)
	})

	it('naked npm with version', () => {
		expect(inferGeneratorPrefix('poi@2.0.1')).toBe(
			`npm:${COMMAND_NAME}-poi@2.0.1`
		)
	})

	it('scoped npm', () => {
		expect(inferGeneratorPrefix('@egoist/poi')).toBe(
			`npm:@egoist/${COMMAND_NAME}-poi`
		)
	})

	it('scoped npm with version', () => {
		expect(inferGeneratorPrefix('@egoist/poi@2.0.1')).toBe(
			`npm:@egoist/${COMMAND_NAME}-poi@2.0.1`
		)
	})
})
