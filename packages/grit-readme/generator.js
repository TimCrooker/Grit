"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const gritenv_1 = require("gritenv");
const config = {
    prompts(grit) {
        return [
            {
                name: 'name',
                type: 'input',
                message: 'What is the name of the project',
                default: `${path_1.default.basename(grit.outDir)}`,
            },
            {
                name: 'description',
                type: 'input',
                message: 'How would you describe the new template',
                default: `my awesome NEW generator`,
            },
            {
                name: 'username',
                type: 'input',
                message: 'What is your GitHub username',
                default: grit.gitUser.username || grit.gitUser.name,
                filter: (val) => val.toLowerCase(),
                store: true,
            },
            {
                name: 'email',
                type: 'input',
                message: 'What is your email?',
                default: grit.gitUser.email,
                store: true,
            },
            {
                name: 'website',
                type: 'input',
                message: 'The URL of your website',
                default(answers) {
                    return `github.com/${answers.username}`;
                },
                store: true,
            },
        ];
    },
    actions: [
        {
            type: 'add',
            files: '**',
        },
        {
            type: 'move',
            patterns: {
                gitignore: '.gitignore',
                '_package.json': 'package.json',
            },
        },
    ],
    async completed(grit) {
        grit.gitInit();
        await grit.npmInstall();
        grit.showProjectTips();
    },
};
module.exports = new gritenv_1.Generator(config);
