// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Grit',
	tagline: 'Generate really interesting tech',
	url: 'https://timcrooker.github.io',
	baseUrl: '/Grit/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'TimCrooker', // Usually your GitHub org/user name.
	projectName: 'Grit', // Usually your repo name.

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
					customCss: require.resolve('./src/css/custom.css'),
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
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'doc',
						docId: 'intro',
						position: 'left',
						label: 'Tutorial',
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
								label: 'Tutorial',
								to: '/docs/intro',
							},
						],
					},
					{
						title: 'Community',
						items: [
							{
								label: 'Stack Overflow',
								href: 'https://stackoverflow.com/questions/tagged/docusaurus',
							},
							{
								label: 'Discord',
								href: 'https://discordapp.com/invite/docusaurus',
							},
							{
								label: 'Twitter',
								href: 'https://twitter.com/docusaurus',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'Blog',
								to: '/blog',
							},
							{
								label: 'GitHub',
								href: 'https://github.com/facebook/docusaurus',
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
