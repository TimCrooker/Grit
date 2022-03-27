"use strict";
const gritenv_1 = require("gritenv");
const config = {
    prompts(grit) { },
    plugins: {
        mergeFiles: [],
    },
    actions() {
        this.add({
            files: '**',
        });
        this.move({
            patterns: {
                gitignore: '.gitignore',
                '_package.json': 'package.json',
            },
        });
    },
    async completed(grit) {
        await grit.npmInstall();
    },
};
module.exports = new gritenv_1.Generator(config);
