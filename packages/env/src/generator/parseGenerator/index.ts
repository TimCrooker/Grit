import path from 'path'
import sum from 'hash-sum'
import { parse } from 'parse-package-name'
import {
	removeLocalPathPrefix,
	isLocalPath,
	PACKAGES_CACHE_PATH,
	REPOS_CACHE_PATH,
} from '@/config'

/*********************TYPES**********************/

interface Basegenerator {
	type: 'local' | 'npm' | 'repo'
	path: string
	hash: string
	subGenerator?: string
}

interface LocalGenerator extends Basegenerator {
	type: 'local'
}

interface NpmGenerator extends Basegenerator {
	type: 'npm'
	name: string
	slug: string
	version: string
}

interface RepoGenerator extends Basegenerator {
	type: 'repo'
	prefix: GeneratorPrefix
	user: string
	repo: string
	version: string
}

type ParsedGenerator = LocalGenerator | NpmGenerator | RepoGenerator

type GeneratorPrefix = 'npm' | 'github' | 'gitlab' | 'bitbucket'

/*********************METHODS**********************/

const GENERATOR_PREFIX_RE = /^(npm|github|bitbucket|gitlab):/

/** Infer prefix for naked generator name (without prefix) */
function inferGeneratorPrefix(generator: string): string {
	if (!GENERATOR_PREFIX_RE.test(generator)) {
		if (generator.startsWith('@')) {
			generator = `npm:${generator.replace(/\/(grit-)?/, '/grit-')}`
		} else if (generator.includes('/')) {
			generator = `github:${generator}`
		} else {
			generator = `npm:${generator.replace(/^(grit-)?/, 'grit-')}`
		}
	}
	return generator
}

function HandleLocalGenerator(generator: string): LocalGenerator {
	let subGenerator: string | undefined
	if (removeLocalPathPrefix(generator).includes(':')) {
		subGenerator = generator.slice(generator.lastIndexOf(':') + 1)
		generator = generator.slice(0, generator.lastIndexOf(':'))
	}
	const absolutePath = path.resolve(generator)

	return {
		type: 'local',
		path: absolutePath,
		hash: sum(absolutePath),
		subGenerator,
	}
}

function HandleNpmGenerator(generator: string): NpmGenerator {
	const hasSubGenerator = generator.indexOf(':') !== -1
	const slug = generator.slice(
		0,
		hasSubGenerator ? generator.indexOf(':') : generator.length
	)
	const parsed = parse(slug)
	const hash = sum(`npm:${parsed.name}`)
	return {
		type: 'npm',
		name: parsed.name,
		version: parsed.version || 'latest',
		slug,
		subGenerator: hasSubGenerator
			? generator.slice(generator.indexOf(':') + 1)
			: undefined,
		hash,
		path: path.join(PACKAGES_CACHE_PATH, hash, 'node_modules', parsed.name),
	}
}

function HandleRepoGenerator(
	generator: string,
	prefix: GeneratorPrefix
): RepoGenerator {
	const PROTOCOL_RE = /^(http(s?):\/\/)(.+).com?(\/)?/

	// remove protocol `http://` or `https://` from generator
	generator = generator.replace(PROTOCOL_RE, ``)

	// remove .git from the end of generator if its a git repository
	generator = generator.replace(/(\.git)/, ``)

	// extract details from generator
	const [, user, repo, version = 'master', subGenerator] =
		/([^/]+)\/([^#:]+)(?:#(.+))?(?::(.+))?$/.exec(generator) || []
	const hash = sum({
		type: 'repo',
		prefix,
		user,
		repo,
		version,
		subGenerator,
	})
	return {
		type: 'repo',
		prefix,
		user,
		repo,
		version,
		subGenerator,
		hash,
		path: path.join(REPOS_CACHE_PATH, hash),
	}
}

function getGeneratorPrefix(generator: string): GeneratorPrefix {
	let prefix: GeneratorPrefix = 'npm'
	let m: RegExpExecArray | null = null
	if ((m = GENERATOR_PREFIX_RE.exec(generator))) {
		prefix = m[1] as GeneratorPrefix
	}
	return prefix
}

/** Get information from the given generator string */
function parseGenerator(generator: string): ParsedGenerator {
	// Handle local generators
	if (isLocalPath(generator)) {
		return HandleLocalGenerator(generator)
	}

	// Append prefix to the generator string
	const prefixedGenerator = inferGeneratorPrefix(generator)

	// Extract prefix from the generator string
	const prefix: GeneratorPrefix = getGeneratorPrefix(prefixedGenerator)

	// Remove prefix from generator to process
	const noPrefixGenerator = prefixedGenerator.replace(GENERATOR_PREFIX_RE, '')

	// Generator is an npm package
	if (prefix === 'npm') {
		return HandleNpmGenerator(noPrefixGenerator)
	}

	// Generator is a repo
	return HandleRepoGenerator(noPrefixGenerator, prefix)
}

/*********************EXPORTS**********************/

export { LocalGenerator, NpmGenerator, RepoGenerator, ParsedGenerator }

export { parseGenerator }
