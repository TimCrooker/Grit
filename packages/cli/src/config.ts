import { StoreGenerator } from 'gritenv'
import { getGitUser } from './utils/gitUser'

// URLs
export const DOCS_URL = 'https://timcrooker.github.io/Grit/'
export const GITHUB_URL = 'https://github.com/TimCrooker/Grit'

// Local path conversions
const RE = /^[./]|(^[a-zA-Z]:)/
export const isLocalPath = (v: string): boolean => RE.test(v)
export const removeLocalPathPrefix = (v: string): string => v.replace(RE, '')

// Local Users git info
const gitUser = getGitUser()
export const UserFullName = gitUser.name
export const UserFirstName = UserFullName.split(' ')[0] || 'User'
export const Username = gitUser.username || 'User'

export const DEBUG = false

export interface GeneratorChoiceValue<T = string> {
	method: T
	generator: StoreGenerator
}

export interface InquirerChoice<T = any> {
	name: string
	value: T
}
