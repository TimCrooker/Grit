import { logger } from './logger'
import { spinner } from './spinner'
import { colors } from './logger'

export class ProjenError extends Error {
	projen: boolean
	cmdOutput?: string

	constructor(message: string) {
		super(message)
		this.projen = true
		this.name = this.constructor.name
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = new Error(message).stack
		}
	}
}

export function handleError(error: Error | ProjenError): void {
	spinner.stop()
	if (error instanceof ProjenError) {
		if (error.cmdOutput) {
			console.error(error.cmdOutput)
		}
		logger.error(error.message)
		logger.debug(colors.dim(error.stack))
	} else if (error.name === 'CACError') {
		logger.error(error.message)
	} else {
		logger.error(error.stack)
	}
	process.exit(1)
}
