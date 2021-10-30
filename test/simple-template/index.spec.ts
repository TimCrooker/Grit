import { renderSimpleTemplate } from '../../src/simple-template'

test('simple template', () => {
	expect(
		renderSimpleTemplate(`hello {foo} {bar}`, { foo: 'world', bar: '!' })
	).toBe('hello world !')
})
