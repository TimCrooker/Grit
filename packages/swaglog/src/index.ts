import { format } from 'date-fns'
import colors from 'chalk'

enum LogLevel {
	ERROR = 1,
	WARN = 2,
	INFO = 3,
	DEBUG = 4,
}

interface LoggerOptions {
	logLevel?: LogLevel
	mock?: boolean
	logTargets?: LogTarget[]
	structuredLogging?: boolean
	timestampFormat?: string
}

export interface LogTarget {
	log(level: LogLevel, message: string): void
}

class ConsoleLogTarget implements LogTarget {
	log(level: LogLevel, message: string): void {
		console.log(message)
	}
}

class Logger {
	private options: Required<LoggerOptions>
	private logTargets: LogTarget[] = []

	constructor(options?: LoggerOptions) {
		this.options = {
			logLevel: LogLevel.INFO,
			mock: false,
			logTargets: [new ConsoleLogTarget()],
			structuredLogging: false,
			timestampFormat: 'yyyy-MM-dd HH:mm:ss',
			...options,
		}

		if (options?.logTargets) {
			this.logTargets = options.logTargets
		}
	}

	setOptions(options: LoggerOptions): void {
		this.options = { ...this.options, ...options }
	}

	private formatMessage(level: LogLevel, ...args: any[]): string {
		const timestamp = format(new Date(), this.options.timestampFormat)
		const levelString = LogLevel[level]
		const message = args.join(' ')

		if (this.options.structuredLogging) {
			return JSON.stringify({ timestamp, level: levelString, message })
		}

		return `${timestamp} [${levelString}] ${message}`
	}

	log(level: LogLevel, ...args: any[]): void {
		if (level < this.options.logLevel) {
			return
		}

		const message = this.formatMessage(level, ...args)
		this.logTargets.forEach((target) => target.log(level, message))
	}

	debug(...args: any[]): void {
		this.log(LogLevel.DEBUG, ...args)
	}

	info(...args: any[]): void {
		this.log(LogLevel.INFO, ...args)
	}

	warn(...args: any[]): void {
		this.log(LogLevel.WARN, ...args)
	}

	error(...args: any[]): void {
		this.log(LogLevel.ERROR, ...args)
	}

	// additional utility loggers

	tip(...args: any[]): void {
		this.info(colors.blue('Tip:'), ...args)
	}

	success(...args: any[]): void {
		this.info(colors.green('Success:'), ...args)
	}

	important(...args: any[]): void {
		this.info(colors.yellow('Important:'), ...args)
	}

	// file action loggers

	fileAction(action: string, filePath: string, extraPath?: string): void {
		const actionMessage = `${colors.magenta(
			action.toUpperCase()
		)}: ${colors.green(filePath)}`
		const extraMessage = extraPath ? ` -> ${colors.green(extraPath)}` : ''
		this.info(actionMessage + extraMessage)
	}

	fileRenamed(oldPath: string, newPath: string): void {
		this.fileAction('renamed', oldPath, newPath)
	}

	fileMoved(oldPath: string, newPath: string): void {
		this.fileAction('moved', oldPath, newPath)
	}

	fileDeleted(filePath: string): void {
		this.fileAction('deleted', filePath)
	}

	fileCreated(filePath: string): void {
		this.fileAction('created', filePath)
	}

	fileCopied(filePath: string, newPath: string): void {
		this.fileAction('copied', filePath, newPath)
	}
}

const logger = new Logger({})

export { logger, Logger, colors, LogLevel, LoggerOptions, ConsoleLogTarget }
