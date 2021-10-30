"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const path_1 = __importDefault(require("path"));
describe('prompts', () => {
    test('Input prompts', async () => {
        const sao = new index_1.SAO({
            generator: path_1.default.join(__dirname, 'fixtures'),
            mock: true,
        });
        await sao.run();
        expect(sao.answers).toEqual({
            name: 'my name',
            age: '',
        });
    });
});
