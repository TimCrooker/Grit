"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const gritenv_1 = require("gritenv");
const generator = path_1.default.join(__dirname, '..');
test('defaults', async () => {
    const grit = await (0, gritenv_1.getGenerator)({
        generator,
        mock: true,
        answers: {
            name: 'test',
            description: 'test',
            username: 'test',
            email: 'test',
            website: 'test',
            jest: true,
        },
    });
    await grit.run();
    expect(await grit.getOutputFiles()).toMatchInlineSnapshot(`
    Array [
      ".gitignore",
      "LICENSE",
      "README.md",
      "__tests__/index.spec.ts",
      "babel.config.js",
      "jest.config.js",
      "package.json",
    ]
  `);
});
