import os from 'os'
import path from 'path'
import { getGitUser } from './utils/git-user'

// App names
export const APP_NAME = 'Grit'
export const COMMAND_NAME = 'grit'

// URLs
export const DOCS_URL = 'https://timcrooker.github.io/Grit/'
export const GITHUB_URL = 'https://github.com/TimCrooker/Grit'

// Store configs
const CACHE_VERSION = 2
export const ROOT_CACHE_PATH = path.join(
	os.homedir(),
	`.${APP_NAME.toLowerCase()}/V${CACHE_VERSION}`
)
export const GENERATORS_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'generators')
export const PACKAGES_CACHE_PATH = path.join(GENERATORS_CACHE_PATH, 'packages')
export const REPOS_CACHE_PATH = path.join(GENERATORS_CACHE_PATH, 'repos')

// Local path conversions
const RE = /^[./]|(^[a-zA-Z]:)/
export const isLocalPath = (v: string): boolean => RE.test(v)
export const removeLocalPathPrefix = (v: string): string => v.replace(RE, '')

// Local Users git info
const gitUser = getGitUser()
export const UserFullName = gitUser.name
export const UserFirstName = UserFullName.split(' ')[0] || 'User'
export const Username = gitUser.username || 'User'

// Plugin configs
export const PLUGIN_MERGE_FILES = ['package.json', 'tsconfig.json', '.babelrc']
