"use strict";
const chai_1 = require("chai");
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const color_regex_1 = require("../src/color-regex");
const color_util_1 = require("../src/color-util");
// Defines a Mocha test suite to group tests of similar kind together
describe("Test CSS hexa shorthand color Regex", () => {
    it('Should match color with only integer', function () {
        chai_1.assert.ok('#000'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with letters and integers', function () {
        chai_1.assert.ok('#f0a'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with only letters', function () {
        chai_1.assert.ok('#fff'.match(color_regex_1.HEXA_COLOR));
    });
    it('Regex should not care about the case', function () {
        chai_1.assert.ok('#Abc'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('#Abc'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc '.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc,'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc;'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc\n'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('#AbG'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#AbcG'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#Ab'.match(color_regex_1.HEXA_COLOR));
    });
});
describe("Test CSS hexa color Regex", () => {
    it('Should match color with only integer', function () {
        chai_1.assert.ok('#000000'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with letters and integers', function () {
        chai_1.assert.ok('#f0f0f0'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with only letters', function () {
        chai_1.assert.ok('#ffffff'.match(color_regex_1.HEXA_COLOR));
    });
    it('Regex should not care about the case', function () {
        chai_1.assert.ok('#Abc012'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('#ffffff '.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff,'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff;'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff\n'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('#fffffg'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#ffffffg'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#fffff'.match(color_regex_1.HEXA_COLOR));
    });
});
describe("Test CSS hexa shorthand color Regex", () => {
    it('Should match color with only integer', function () {
        chai_1.assert.ok('#000'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with letters and integers', function () {
        chai_1.assert.ok('#f0a'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with only letters', function () {
        chai_1.assert.ok('#fff'.match(color_regex_1.HEXA_COLOR));
    });
    it('Regex should not care about the case', function () {
        chai_1.assert.ok('#Abc'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('#Abc'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc '.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc,'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc;'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#Abc\n'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('#AbG'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#AbcG'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#Ab'.match(color_regex_1.HEXA_COLOR));
    });
});
describe("Test CSS hexa color Regex", () => {
    it('Should match color with only integer', () => {
        chai_1.assert.ok('#000000'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with letters and integers', () => {
        chai_1.assert.ok('#f0f0f0'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match color with only letters', () => {
        chai_1.assert.ok('#ffffff'.match(color_regex_1.HEXA_COLOR));
    });
    it('Regex should not care about the case', () => {
        chai_1.assert.ok('#Abc012'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should match with different characters at the end', () => {
        chai_1.assert.ok('#ffffff '.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff,'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff;'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.ok('#ffffff\n'.match(color_regex_1.HEXA_COLOR));
    });
    it('Should not match', () => {
        chai_1.assert.notOk('#fffffg'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#ffffffg'.match(color_regex_1.HEXA_COLOR));
        chai_1.assert.notOk('#fffff'.match(color_regex_1.HEXA_COLOR));
    });
});
describe('Test utility fonction', () => {
    it('Should return the rgb value of a color', () => {
        chai_1.assert.deepEqual(color_util_1.default.getRGB('#fff'), [255, 255, 255], 'Should return rgb values for CSS hexa shorthand color');
        chai_1.assert.deepEqual(color_util_1.default.getRGB('#ffffff'), [255, 255, 255], 'Should return rgb values for CSS hexa color');
    });
    it('Should return the color luminance', () => {
        chai_1.assert.equal(color_util_1.default.luminance('#fff'), 1, 'Should be "1" for #fff');
        chai_1.assert.equal(color_util_1.default.luminance('#ffffff'), 1, 'Should be "1" for #ffffff');
        chai_1.assert.equal(color_util_1.default.luminance('#000'), 0, 'Should be "0" for #000');
        chai_1.assert.equal(color_util_1.default.luminance('#000000'), 0, 'Should be "0" for #000000');
        chai_1.assert.equal(color_util_1.default.luminance('#ccc').toFixed(1), 0.6, 'Should be around "0.6" for #ccc');
    });
});
//# sourceMappingURL=extension.test.js.map