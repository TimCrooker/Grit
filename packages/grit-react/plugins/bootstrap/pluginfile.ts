/* eslint-disable @typescript-eslint/camelcase */

import { Base, PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'React-Bootstrap',
	description:
		'Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit.',
	url: 'https://getbootstrap.com/docs/5.0/getting-started/introduction/',
	extend({ css_features }) {
		const base = {
			_app: {
				import: ['import "@/styles/app.scss"'],
			},
			_docs: {
				import: ['import "@/styles/docs.scss"'],
			},
		} as Base

		if (css_features !== 'scss') {
			base._app.import = ['import "bootstrap/dist/css/bootstrap.min.css"']
		}
		return base
	},
}

module.exports = config
