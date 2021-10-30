import os from 'os'
import {
	parseGenerator,
	ParsedGenerator,
	getGeneratorPrefix,
	inferGeneratorPrefix,
} from './'

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
        "path": "~/.Projenerator/V2/repos/e66c30fe",
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
        "path": "~/.Projenerator/V2/repos/6e0c0844",
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
        "hash": "096eb1e0",
        "name": "sao-nm",
        "path": "~/.Projenerator/V2/packages/096eb1e0/node_modules/sao-nm",
        "slug": "sao-nm",
        "subGenerator": undefined,
        "type": "npm",
        "version": "latest",
      }
    `)
	})

	it('Npm package with version', () => {
		expect(parse(`nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "545f7d07",
        "name": "sao-nm",
        "path": "~/.Projenerator/V2/packages/545f7d07/node_modules/sao-nm",
        "slug": "sao-nm@2.0.1",
        "subGenerator": undefined,
        "type": "npm",
        "version": "2.0.1",
      }
    `)
	})
	it('Scoped Npm package', () => {
		expect(parse(`@egoist/nm`)).toMatchInlineSnapshot(`
      Object {
        "hash": "427e6ec2",
        "name": "@egoist/sao-nm",
        "path": "~/.Projenerator/V2/packages/427e6ec2/node_modules/@egoist/sao-nm",
        "slug": "@egoist/sao-nm",
        "subGenerator": undefined,
        "type": "npm",
        "version": "latest",
      }
    `)
	})
	it('Scoped Npm package with version', () => {
		expect(parse(`@egoist/nm@2.0.1`)).toMatchInlineSnapshot(`
      Object {
        "hash": "5ff93739",
        "name": "@egoist/sao-nm",
        "path": "~/.Projenerator/V2/packages/5ff93739/node_modules/@egoist/sao-nm",
        "slug": "@egoist/sao-nm@2.0.1",
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
        "path": "~/.Projenerator/V2/repos/766eaa60",
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
        "hash": "096eb1e0",
        "name": "sao-nm",
        "path": "~/.Projenerator/V2/packages/096eb1e0/node_modules/sao-nm",
        "slug": "sao-nm",
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
		expect(inferGeneratorPrefix('poi')).toBe('npm:sao-poi')
	})

	it('naked npm with version', () => {
		expect(inferGeneratorPrefix('poi@2.0.1')).toBe('npm:sao-poi@2.0.1')
	})

	it('scoped npm', () => {
		expect(inferGeneratorPrefix('@egoist/poi')).toBe('npm:@egoist/sao-poi')
	})

	it('scoped npm with version', () => {
		expect(inferGeneratorPrefix('@egoist/poi@2.0.1')).toBe(
			'npm:@egoist/sao-poi@2.0.1'
		)
	})
})
