// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
		'introduction',
		'getting-started',
		'product-problem',
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
      items: ['create-generator/overview', 'create-generator/quick-start', {
				type: 'category',
				label: 'Generator File',
				items: [
					'generator-file/overview',
					'generator-file/prepare',
					'generator-file/prompts',
					'generator-file/data',
					// 'generator-file/plugins',
					'generator-file/actions',
					'generator-file/completed',
					'generator-file/generator-instance',
				]
			},
			// {
			// 	type: 'category',
			// 	label: 'Plugins',
			// },
			// 'create-generator/chaining',
		],
    },
  ],
}

module.exports = sidebars
