"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const variables_extractor_1 = require("../../src/lib/extractors/variables-extractor");
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
    // Sass
    it('Should match (sass variables)', function () {
        chai_1.assert.ok('$var:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('$var-two:'.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    it('Should not match (sass variables)', function () {
        chai_1.assert.notOk('$var'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.notOk('$ :'.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    // less
    it('Should match (less variables)', function () {
        chai_1.assert.ok('@var:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('@var-two:'.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    it('Should not match (less variables)', function () {
        chai_1.assert.notOk('@var'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.notOk('@ :'.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    // css variables (works for postcss too)
    it('Should match (css variables)', function () {
        chai_1.assert.ok('--var:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('--var-two:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('--var-:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('--var--two:'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('--varTwo:'.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    it('Should not match (css variables)', function () {
        chai_1.assert.notMatch('--var', variables_extractor_1.DECLARATION_REGEXP);
        chai_1.assert.notMatch('-- :', variables_extractor_1.DECLARATION_REGEXP);
        chai_1.assert.notMatch('-var:', variables_extractor_1.DECLARATION_REGEXP);
        chai_1.assert.notMatch(':', variables_extractor_1.DECLARATION_REGEXP);
    });
    // stylus variables
    it('Should match (stylus variables)', function () {
        chai_1.assert.ok('var='.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.ok('var-two='.match(variables_extractor_1.DECLARATION_REGEXP));
    });
    it('Should not match (stylus variables)', function () {
        chai_1.assert.notOk('var'.match(variables_extractor_1.DECLARATION_REGEXP));
        chai_1.assert.notOk('-- ='.match(variables_extractor_1.DECLARATION_REGEXP));
    });
});
describe('Test variables use regexp', function () {
    // Sass
    it('Should match (sass variables)', function () {
        chai_1.assert.ok('$var'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('$var-two'.match(variables_extractor_1.REGEXP));
    });
    it('Should not match (sass variables)', function () {
        chai_1.assert.notOk('$ '.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('$'.match(variables_extractor_1.REGEXP));
    });
    // less
    it('Should match (less variables)', function () {
        chai_1.assert.ok('@var'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('@var-two'.match(variables_extractor_1.REGEXP));
    });
    it('Should not match (less variables)', function () {
        chai_1.assert.notOk('@'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('@ '.match(variables_extractor_1.REGEXP));
    });
    // css variables (works for postcss too)
    it('Should match (css variables)', function () {
        chai_1.assert.ok('var(--var)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('var(--var-two)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('var(--var-)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('var(--var--two)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok('var(--varTwo)'.match(variables_extractor_1.REGEXP));
    });
    it('Should not match (css variables)', function () {
        chai_1.assert.notOk('--var'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('-- '.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('--'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('var(--)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('var(-var)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('var(var)'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('var()'.match(variables_extractor_1.REGEXP));
    });
    // stylus variables
    it('Should match (stylus variables)', function () {
        chai_1.assert.ok(' var'.match(variables_extractor_1.REGEXP));
        chai_1.assert.ok(' var-two'.match(variables_extractor_1.REGEXP));
    });
    it('Should not match (stylus variables)', function () {
        chai_1.assert.notOk('var'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk('--'.match(variables_extractor_1.REGEXP));
        chai_1.assert.notOk(' 120'.match(variables_extractor_1.REGEXP));
    });
});
//# sourceMappingURL=variables-extractor.test.js.map