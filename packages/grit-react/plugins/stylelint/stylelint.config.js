module.exports = {
	extends: ['stylelint-config-standard'],
	<%_ if(css_features.includes("scss")) { _%>
		plugins: ['stylelint-scss'],
	<%_ } _%>
	rules: {
		indentation: 'tab',
	},
}
