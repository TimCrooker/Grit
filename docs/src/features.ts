import {
	GetDatabaseLogoId,
	GetFeatureLogoId,
	GetFrameworkLogoId,
} from '../static/img/images'

export type Feature = {
	title: string
	publicId?: string
	imageUrl?: string
	link?: string
}

export const frameworks: Feature[] = [
	{
		publicId: GetFrameworkLogoId('react'),
		title: 'React',
		link: 'https://reactjs.org/',
	},
	{
		publicId: GetFrameworkLogoId('nextjs'),
		title: 'Next',
		link: 'https://nextjs.org/',
	},
	{
		publicId: GetFrameworkLogoId('angular'),
		title: 'Angular',
		link: 'https://angular.io/',
	},
	{
		publicId: GetFrameworkLogoId('react'),
		title: 'React Native',
		link: 'https://reactnative.dev/',
	},
	{
		publicId: GetFrameworkLogoId('vue'),
		title: 'Vue',
		link: 'https://vuejs.org/',
	},
	{
		publicId: GetFrameworkLogoId('svelte'),
		title: 'Svelte',
		link: 'https://svelte.dev/',
	},
	{
		publicId: GetFrameworkLogoId('express'),
		title: 'Express',
		link: 'https://expressjs.com/',
	},
	{
		publicId: GetFrameworkLogoId('koa'),
		title: 'KOA',
		link: 'https://koajs.com/',
	},
]

export const databases: Feature[] = [
	{
		publicId: GetDatabaseLogoId('mongodb'),
		title: 'MongoDB',
		link: 'https://www.mongodb.com/',
	},
	{
		publicId: GetDatabaseLogoId('mysql'),
		title: 'MySql',
		link: 'https://dev.mysql.com/',
	},
	{
		publicId: GetDatabaseLogoId('postgres'),
		title: 'PostgreSQL',
		link: 'https://www.postgresql.org/',
	},
]

export const plugins: Feature[] = [
	{
		publicId: GetFeatureLogoId('styled-components'),
		title: 'Styled Components',
		link: 'https://youtube.com',
	},
	{
		publicId: GetFeatureLogoId('tailwind'),
		title: 'TailwindCSS',
	},
	{
		publicId: GetFeatureLogoId('element-ui'),
		title: 'Element-UI',
	},
	{
		publicId: GetFeatureLogoId('eslint'),
		title: 'ESLint',
	},
	{
		publicId: GetFeatureLogoId('stylelint'),
		title: 'StyleLint',
	},
	{
		publicId: GetFeatureLogoId('docker'),
		title: 'Docker',
	},
	{
		publicId: GetFeatureLogoId('css'),
		title: 'CSS',
	},
	{
		publicId: GetFeatureLogoId('bootstrap'),
		title: 'Bootstrap',
	},
	{
		publicId: GetFeatureLogoId('material-ui'),
		title: 'Material-UI',
	},
	// {
	// 	publicId: GetFeatureLogoId('cyclejs'),
	// 	title: 'CycleJS',
	// },
	{
		publicId: GetFeatureLogoId('redux'),
		title: 'Redux',
	},
	// {
	// 	publicId: GetFeatureLogoId('jquery'),
	// 	title: 'jQuery',
	// },
	// {
	// 	publicId: GetFeatureLogoId('javascript'),
	// 	title: 'Javascript',
	// },
	// {
	// 	publicId: GetFeatureLogoId('html'),
	// 	title: 'HTML',
	// },
	// {
	// 	publicId: GetFeatureLogoId('spring'),
	// 	title: 'Spring',
	// },
	// {
	// 	publicId: GetFeatureLogoId('webpack'),
	// 	title: 'Webpack',
	// },
	// {
	// 	publicId: GetFeatureLogoId('redis'),
	// 	title: 'Redis',
	// },
	// {
	// 	publicId: GetFeatureLogoId('vscode'),
	// 	title: 'VScode',
	// },
	// {
	// 	publicId: GetFeatureLogoId('webstorm'),
	// 	title: 'Webstorm',
	// },
]
