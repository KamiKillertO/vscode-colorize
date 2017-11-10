"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hexa_extractor_1 = require("../../src/lib/colors/extractors/hexa-extractor");
// Defines a Mocha test suite to group tests of similar kind together
describe('Test CSS hexa shorthand color Regex', () => {
    it('Should match color with only integer', function () {
        chai_1.assert.ok('#000'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match color with letters and integers', function () {
        chai_1.assert.ok('#f0a'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match color with only letters', function () {
        chai_1.assert.ok('#fff'.match(hexa_extractor_1.REGEXP));
    });
    it('Regex should not care about the case', function () {
        chai_1.assert.ok('#Abc'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match inside a string', function () {
        chai_1.assert.ok('"#Abc"'.match(hexa_extractor_1.REGEXP));
    });
    it('Should accept accept an alpha value', function () {
        chai_1.assert.ok('#0000'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('#Abc'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#Abc '.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#Abc,'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#Abc;'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#Abc\n'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#Abc)\n'.match(hexa_extractor_1.REGEXP));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('#AbG'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.notOk('#AbcG'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.notOk('#Ab'.match(hexa_extractor_1.REGEXP));
    });
});
describe('Test CSS hexa color Regex', () => {
    it('Should match color with only integer', function () {
        chai_1.assert.ok('#000000'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match color with letters and integers', function () {
        chai_1.assert.ok('#f0f0f0'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match color with only letters', function () {
        chai_1.assert.ok('#ffffff'.match(hexa_extractor_1.REGEXP));
    });
    it('Regex should not care about the case', function () {
        chai_1.assert.ok('#Abc012'.match(hexa_extractor_1.REGEXP));
    });
    it('Sould match inside a string', function () {
        chai_1.assert.ok('"#ffffff"'.match(hexa_extractor_1.REGEXP));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('#ffffff '.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#ffffff,'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#ffffff;'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#ffffff\n'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.ok('#ffffff)'.match(hexa_extractor_1.REGEXP));
    });
    it('Should accept accept an alpha value', function () {
        chai_1.assert.ok('#00000000'.match(hexa_extractor_1.REGEXP));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('#fffffg'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.notOk('#ffffffg'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.notOk('#fffff'.match(hexa_extractor_1.REGEXP));
        chai_1.assert.notOk('#fffffff'.match(hexa_extractor_1.REGEXP));
    });
});
//# sourceMappingURL=hexa-extrator.test.js.map