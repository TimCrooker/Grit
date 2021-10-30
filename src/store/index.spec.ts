import path from 'path'
import { Store } from './'

describe('Base store', () => {
	const storePath = path.join(__dirname, 'fixtures')
	const item = {
		type: 'local',
		path: 'aalskdjfalksdjf',
		hash: 'hash',
	}
	const items: { [k: string]: typeof item } = {
		'12345678': item,
	}

	const store = new Store({ storePath })

	test('set generator into store', () => {
		store.set('generators', items)
	})

	test('get generators from store', () => {
		expect(store.get('generators')).toBe(items)
		expect(store.get('generators.12345678')).toBe(item)
	})

	test('read store', () => {
		const content = store.read()
		console.log(content)
		expect(content).toBeDefined()
	})
	//create after all statement to clean up the test store
})
