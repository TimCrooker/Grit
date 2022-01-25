import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'Ant Design',
	description:
		'A design system for enterprise-level products. Create an efficient and enjoyable work experience.',
	url: 'https://ant.design/docs/react/introduce',
	extend: {
		_app: { import: ['import "antd/dist/antd.css"'] },
	},
}

module.exports = config
