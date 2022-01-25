/* eslint-disable @typescript-eslint/camelcase */
import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'StyleLint',
	description:
		'Styled System is a mighty, modern linter that helps you avoid errors and enforce conventions in your styles.',
	url: 'https://stylelint.io/user-guide/get-started',
	apply(pkg, { css_features }) {
		if (css_features !== 'scss') {
			delete pkg.devDependencies['stylelint-scss']
		}

		return pkg
	},
}

module.exports = config
