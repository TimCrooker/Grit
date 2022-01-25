<%_ if (ui.includes("chakra-ui")) { _%>
const path = require("path");
<%_ } _%>

<%_ if (ui.includes("chakra-ui")) { _%>
const toPath = (_path) => path.join(process.cwd(), _path);
<%_ } _%>

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
			"@storybook/addon-links",
			"@storybook/addon-essentials",
			"@storybook/addon-knobs",

			<%_ if (css_features.includes("scss")) { _%>
        "@storybook/preset-scss",
      <%_ } _%>

			<%_ if (ui.includes("tailwind")) { _%>
        "@storybook/addon-postcss",
      <%_ } _%>

      <%_ if (css_features.includes("styled-components")) { _%>
        "storybook-addon-styled-component-theme/dist/register",
      <%_ } _%>
    ]
};
