import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'CSS / styled-jsx',
	description: 'CRA comes with built-in support for CSS and CSS Modules.',
	url: 'https://create-react-app.dev/docs/adding-a-stylesheets',
	extend: {
		_app: {
			import: ['import "@/styles/global.css"'],
		},
	},
}

module.exports = config
