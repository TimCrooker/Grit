// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
		'introduction',
		'getting-started',
		{
			type: 'category',
			label: 'Usage',
			collapsed: true,
			items: [
				// 'usage/overview',
				'usage/install',
				'usage/find',
				'usage/run',
				'usage/update',
				'usage/remove',
				'usage/help',
			]
		},
    {
      type: 'category',
      label: 'Create Generator',
			collapsed: true,
      items: ['create-generator/overview',{
				type: 'category',
				label: 'Generator File',
				items: [
					'generator-file/overview',
					'generator-file/prepare',
					'generator-file/prompts',
					// 'generator-file/data',
					// 'generator-file/plugins',
					// 'generator-file/actions',
					'generator-file/completed',
				]
			},
			// {
			// 	type: 'category',
			// 	label: 'Plugins',
			// 	items: [
			// 		'plugins/plugins'
			// 	]
			// },
			// 'create-generator/chaining',
		],
    },
  ],
}

module.exports = sidebars
