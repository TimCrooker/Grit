import { evaluate, getGlobPatterns, escapeDots } from './index'

describe('Glob', () => {
	describe('evaluate', () => {
		it('should evaluate the expression correctly', () => {
			const result = evaluate('data.x + data.y', { x: 1, y: 2 })
			expect(result).toBe(3)
		})

		it('should handle errors gracefully', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
			evaluate('data.x + data.y', null)
			expect(consoleSpy).toHaveBeenCalledTimes(2)
			consoleSpy.mockRestore()
		})
	})

	describe('getGlobPatterns', () => {
		it('should return patterns that meet the condition', () => {
			const files = { '*.ts': 'data.x > 1', '*.js': 'data.x <= 1' }
			const context = { x: 2 }
			const result = getGlobPatterns(files, context)
			expect(result).toEqual(['*.ts'])
		})

		it('should return excluded patterns when asked', () => {
			const files = { '*.ts': 'data.x > 1', '*.js': 'data.x <= 1' }
			const context = { x: 2 }
			const result = getGlobPatterns(files, context, true)
			expect(result).toEqual(['*.js'])
		})

		it('should evaluate string conditions', () => {
			const files = { '*.ts': 'data.x > 1' }
			const context = { x: 2 }
			const result = getGlobPatterns(files, context)
			expect(result).toEqual(['*.ts'])
		})

		it('should handle non-string conditions', () => {
			const files = { '*.ts': true }
			const context = {}
			const result = getGlobPatterns(files, context)
			expect(result).toEqual(['*.ts'])
		})
	})

	describe('escapeDots', () => {
		it('should escape dots in the string', () => {
			const result = escapeDots('hello.world')
			expect(result).toBe('hello\\.world')
		})
	})
})
