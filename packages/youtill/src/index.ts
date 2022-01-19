import { logger, LogLevel } from 'swaglog'

export * from './merge'
export * from './binary'
export * from './cmd'
export * from './files'

export const setLogLevel = (logLevel: LogLevel = 1): void => {
	logger.setOptions({ logLevel })
}
