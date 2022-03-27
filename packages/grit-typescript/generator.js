"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const gritenv_1 = require("gritenv");
const config = {
    prompts(grit) {
        this.input({
            name: 'name',
            message: 'What is the name of the new project',
            default: `${path_1.default.basename(grit.outDir)}`,
            filter: (val) => val.toLowerCase(),
        });
        this.input({
            name: 'description',
            message: 'How would you describe the new template',
            default: `my awesome NEW generator`,
        });
        this.input({
            name: 'username',
            message: 'What is your GitHub username',
            default: grit.gitUser.username || grit.gitUser.name,
            filter: (val) => val.toLowerCase(),
            store: true,
        });
        this.input({
            name: 'email',
            message: 'What is your email?',
            default: grit.gitUser.email,
            store: true,
        });
        this.input({
            name: 'website',
            message: 'The URL of your website',
            default(data) {
                return `github.com/${data.username}`;
            },
            store: true,
        });
        this.confirm({
            name: 'jest',
            plugin: true,
            message: 'Would you like to use Jest for testing?',
            default: true,
        });
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
