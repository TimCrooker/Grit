// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const path = require('path')

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Grit',
	tagline: 'Generate really interesting tech',
	url: 'https://timcrooker.github.io',
	trailingSlash: true,
	baseUrl: '/Grit/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'TimCrooker', // Usually your GitHub org/user name.
	projectName: 'Grit', // Usually your repo name.
	plugins: [
		'docusaurus-plugin-sass',
		[
			'docusaurus-plugin-module-alias',
			{
				alias: {
					'@': path.resolve(__dirname, './src/'),
				},
			},
		],
	],
	presets: [
		[
			'@docusaurus/preset-classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl: 'https://github.com/TimCrooker/Grit/edit/master/docs/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.scss'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'Grit',
				logo: {
					alt: 'My Site Logo',
					src: 'img/logo.png',
				},
				items: [
					{
						type: 'doc',
						docId: 'introduction',
						position: 'left',
						label: 'Docs',
					},
					{
						href: 'https://github.com/TimCrooker/grit',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Docs',
						items: [
							{
								label: 'Introduction',
								to: 'docs/introduction',
							},
							{
								label: 'Usage',
								to: 'docs/usage/overview',
							},
							{
								label: 'Creating Generators',
								to: 'docs/create-generator/quick-start',
							},
							{
								label: 'Advanved Usage',
								to: 'docs/advanced-usage',
							},
						],
					},
					{
						title: 'Community',
						items: [
							{
								label: 'Stack Overflow',
								href: 'docs/introduction',
							},
							{
								label: 'Discord',
								href: 'docs/introduction',
							},
							{
								label: 'Twitter',
								href: 'docs/introduction',
							},
						],
					},
					{
						title: 'Help',
						items: [
							{
								label: 'GitHub',
								href: 'https://github.com/timcrooker/grit',
							},
							{
								label: 'Submit Issue',
								href: 'https://github.com/TimCrooker/Grit/issues',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Botsea, Inc.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
			// googleAnalytics: {
			// 	trackingID: 'G-T5F55J3XVN',
			// 	// Optional fields.
			// 	anonymizeIP: false, // Should IPs be anonymized?
			// },
		}),
}

module.exports = config
