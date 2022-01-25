import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'React Redux',
	description:
		'Redux helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.',
	url: 'https://redux.js.org/introduction/getting-started',
	extend: {
		_app: {
			import: [
				"import { Provider } from 'react-redux'",
				"import store from '@/redux/store'",
			],
			inner: [],
			wrapper: [['<Provider store={store}>', '</Provider>']],
		},
		testSetup: {
			import: [
				"import { Provider } from 'react-redux'",
				"import store from '@/redux/store'",
			],
			wrapper: [['<Provider store={store}>', '</Provider>']],
		},
	},
}

module.exports = config
