/* eslint-disable @typescript-eslint/camelcase */
import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'Storybook',
	description:
		'Storybook is an open source tool for developing UI components in isolation for React, Vue, Angular, and more. It makes building stunning UIs organized and efficient.',
	url: 'https://storybook.js.org/docs/react/get-started/introduction',
	apply(pkg, { css_features, ui }) {
		if (css_features !== 'styled-components') {
			delete pkg.devDependencies['storybook-addon-styled-component-theme']
		}
		if (css_features !== 'scss') {
			delete pkg.devDependencies['@storybook/preset-scss']
		}
		if (!ui.includes('tailwind')) {
			delete pkg.devDependencies['@storybook/addon-postcss']
		}

		return pkg
	},
}

module.exports = config
