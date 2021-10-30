"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_template_1 = require("../../src/simple-template");
test('simple template', () => {
    expect(simple_template_1.renderSimpleTemplate(`hello {foo} {bar}`, { foo: 'world', bar: '!' })).toBe('hello world !');
});
