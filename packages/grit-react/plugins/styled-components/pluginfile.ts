import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'Styled Components',
	description:
		'Utilizing tagged template literals (a recent addition to JavaScript) and the power of CSS, styled-components allows you to write actual CSS code to style your components.',
	url: 'https://styled-components.com/docs',
	extend: {
		_app: {
			import: [
				'import { StyledThemeProvider } from "definitions/styled-components"',
			],
			inner: [],
			wrapper: [['<StyledThemeProvider>', '</StyledThemeProvider>']],
		},
	},
	apply(pkg, { pm }) {
		const isNpm = pm === 'npm'
		if (isNpm) {
			delete pkg.resolutions
		}
		return pkg
	},
}

module.exports = config
