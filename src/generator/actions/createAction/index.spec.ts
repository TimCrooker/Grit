import { createAction } from '.'

describe('Create actions', () => {
	it('add', () => {
		const action = {
			files: ['file.ts'],
			templateDir: './templates',
			filters: { ['**/*.ts']: true, ['**/*.js']: 'false' },
			transform: true,
			transformInclude: ['**/*.ts'],
			transformExclude: ['**/*.js'],
			data: (context) => ({
				answers: context.answers,
			}),
		}
		const actionOut = createAction.add(action)

		expect(actionOut).toEqual({
			...action,
			type: 'add',
		})
	})

	it('move', () => {
		const action = {
			patterns: { 'path.js': 'file.ts' },
		}
		const actionOut = createAction.move(action)

		expect(actionOut).toEqual({
			...action,
			type: 'move',
		})
	})

	it('copy', () => {
		const action = {
			patterns: { 'path.js': 'file.ts' },
		}
		const actionOut = createAction.copy(action)

		expect(actionOut).toEqual({
			...action,
			type: 'copy',
		})
	})

	it('modify', () => {
		const action = {
			files: ['path.js'],
			handler: (data, filepath) => {
				return {
					...data,
					filepath,
				}
			},
		}
		const actionOut = createAction.modify(action)

		expect(actionOut).toEqual({
			...action,
			type: 'modify',
		})
	})

	it('remove', () => {
		const action = {
			files: ['path.js'],
		}
		const actionOut = createAction.remove(action)

		expect(actionOut).toEqual({
			...action,
			type: 'remove',
		})
	})
})
