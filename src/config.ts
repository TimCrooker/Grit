import os from 'os'
import path from 'path'

export const APP_NAME = 'Projenerator'

const CACHE_VERSION = 2

export const ROOT_CACHE_PATH = path.join(
	os.homedir(),
	`.${APP_NAME}/V${CACHE_VERSION}`
)
export const REPOS_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'repos')
export const PACKAGES_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'packages')
export const GENERATORS_CACHE_PATH = path.join(ROOT_CACHE_PATH, 'generators')

const RE = /^[./]|(^[a-zA-Z]:)/

export const isLocalPath = (v: string): boolean => RE.test(v)

export const removeLocalPathPrefix = (v: string): string => v.replace(RE, '')
