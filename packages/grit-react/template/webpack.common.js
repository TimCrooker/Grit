const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: 'bundle.js',
	},
	module: {
		rules: [
			// typescript transpiling
			{
				test: /\.(ts|js)x?$/i,
				include: path.resolve(__dirname, 'src'),
				loader: 'ts-loader',
			},
			// loads files and images
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
			// global css files
			{
				test: /\.(css|s[ac]ss)$/i,
				use: ['style-loader', 'css-loader'
				<%_ if (css_features.includes('scss')) { _%> 
					,'sass-loader'
				<%_ } _%> 
				<%_ if (ui.includes('tailwind')) { _%> 
					,'postcss-loader'
				<%_ } _%>
			],
			},
		],
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin()],
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
		}),
	],
}
