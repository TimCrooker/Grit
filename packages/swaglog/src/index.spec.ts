import { Logger, LogLevel, LogTarget } from '.'

class MockLogTarget implements LogTarget {
	public messages: string[] = []

	log(level: LogLevel, message: string): void {
		this.messages.push(message)
	}
}

describe('Logger', () => {
	let mockLogTarget: MockLogTarget
	let logger: Logger

	beforeEach(() => {
		mockLogTarget = new MockLogTarget()
		logger = new Logger({
			logLevel: LogLevel.DEBUG,
			logTargets: [mockLogTarget],
			structuredLogging: false, // Set to true for structured logging tests
		})
	})

	test('logs debug messages', () => {
		logger.debug('Debug message')
		expect(mockLogTarget.messages[0]).toContain('Debug message')
	})

	test('logs info messages', () => {
		logger.info('Info message')
		expect(mockLogTarget.messages[0]).toContain('Info message')
	})

	test('logs warnings', () => {
		logger.warn('Warning message')
		expect(mockLogTarget.messages[0]).toContain('Warning message')
	})

	test('logs errors', () => {
		logger.error('Error message')
		expect(mockLogTarget.messages[0]).toContain('Error message')
	})

	test('logs tips', () => {
		logger.tip('Tip message')
		expect(mockLogTarget.messages[0]).toContain('Tip message')
	})

	test('logs success messages', () => {
		logger.success('Success message')
		expect(mockLogTarget.messages[0]).toContain('Success message')
	})

	// Add more tests for file actions and other utility loggers as needed

	// Example for file actions
	test('logs file actions', () => {
		logger.fileRenamed('oldPath.txt', 'newPath.txt')
		expect(mockLogTarget.messages[0]).toContain('RENAMED')

		const containsExpectedMessage =
			mockLogTarget.messages[0].includes('oldPath.txt') &&
			mockLogTarget.messages[0].includes('newPath.txt')
		expect(containsExpectedMessage).toBe(true)
	})
})
