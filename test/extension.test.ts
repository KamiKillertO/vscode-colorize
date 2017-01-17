import { assert } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { HEXA_COLOR } from '../src/color-regex';
import ColorUtil from '../src/color-util';

// Defines a Mocha test suite to group tests of similar kind together
describe("Test CSS hexa shorthand color Regex", () => {
  it('Should match color with only integer', function () {
    assert.ok('#000'.match(HEXA_COLOR));
  });
  it('Should match color with letters and integers', function () {
    assert.ok('#f0a'.match(HEXA_COLOR));
  });
  it('Should match color with only letters', function () {
    assert.ok('#fff'.match(HEXA_COLOR));
  });
  it('Regex should not care about the case', function () {
    assert.ok('#Abc'.match(HEXA_COLOR));
  });
  it('Should match with different characters at the end', function () {
    assert.ok('#Abc'.match(HEXA_COLOR));
    assert.ok('#Abc '.match(HEXA_COLOR));
    assert.ok('#Abc,'.match(HEXA_COLOR));
    assert.ok('#Abc;'.match(HEXA_COLOR));
    assert.ok('#Abc\n'.match(HEXA_COLOR));
  });
  it('Should not match', function () {
    assert.notOk('#AbG'.match(HEXA_COLOR));
    assert.notOk('#AbcG'.match(HEXA_COLOR));
    assert.notOk('#Ab'.match(HEXA_COLOR));
  });
});
describe("Test CSS hexa color Regex", () => {
  it('Should match color with only integer', function () {
    assert.ok('#000000'.match(HEXA_COLOR));
  });
  it('Should match color with letters and integers', function () {
    assert.ok('#f0f0f0'.match(HEXA_COLOR));
  });
  it('Should match color with only letters', function () {
    assert.ok('#ffffff'.match(HEXA_COLOR));
  });
  it('Regex should not care about the case', function () {
    assert.ok('#Abc012'.match(HEXA_COLOR));
  });
  it('Should match with different characters at the end', function () {
    assert.ok('#ffffff '.match(HEXA_COLOR));
    assert.ok('#ffffff,'.match(HEXA_COLOR));
    assert.ok('#ffffff;'.match(HEXA_COLOR));
    assert.ok('#ffffff\n'.match(HEXA_COLOR));
  });
  it('Should not match', function () {
    assert.notOk('#fffffg'.match(HEXA_COLOR));
    assert.notOk('#ffffffg'.match(HEXA_COLOR));
    assert.notOk('#fffff'.match(HEXA_COLOR));
  });
});
describe("Test CSS hexa shorthand color Regex", () => {
  it('Should match color with only integer', function () {
    assert.ok('#000'.match(HEXA_COLOR));
  });
  it('Should match color with letters and integers', function () {
    assert.ok('#f0a'.match(HEXA_COLOR));
  });
  it('Should match color with only letters', function () {
    assert.ok('#fff'.match(HEXA_COLOR));
  });
  it('Regex should not care about the case', function () {
    assert.ok('#Abc'.match(HEXA_COLOR));
  });
  it('Should match with different characters at the end', function () {
    assert.ok('#Abc'.match(HEXA_COLOR));
    assert.ok('#Abc '.match(HEXA_COLOR));
    assert.ok('#Abc,'.match(HEXA_COLOR));
    assert.ok('#Abc;'.match(HEXA_COLOR));
    assert.ok('#Abc\n'.match(HEXA_COLOR));
  });
  it('Should not match', function () {
    assert.notOk('#AbG'.match(HEXA_COLOR));
    assert.notOk('#AbcG'.match(HEXA_COLOR));
    assert.notOk('#Ab'.match(HEXA_COLOR));
  });
});
describe("Test CSS hexa color Regex", () => {
  it('Should match color with only integer', () => {
    assert.ok('#000000'.match(HEXA_COLOR));
  });
  it('Should match color with letters and integers', () => {
    assert.ok('#f0f0f0'.match(HEXA_COLOR));
  });
  it('Should match color with only letters', () => {
    assert.ok('#ffffff'.match(HEXA_COLOR));
  });
  it('Regex should not care about the case', () => {
    assert.ok('#Abc012'.match(HEXA_COLOR));
  });
  it('Should match with different characters at the end', () => {
    assert.ok('#ffffff '.match(HEXA_COLOR));
    assert.ok('#ffffff,'.match(HEXA_COLOR));
    assert.ok('#ffffff;'.match(HEXA_COLOR));
    assert.ok('#ffffff\n'.match(HEXA_COLOR));
  });
  it('Should not match', () => {
    assert.notOk('#fffffg'.match(HEXA_COLOR));
    assert.notOk('#ffffffg'.match(HEXA_COLOR));
    assert.notOk('#fffff'.match(HEXA_COLOR));
  });
});

describe('Test utility fonction', () => {
  it('Should return the rgb value of a color', () => {
    assert.deepEqual(ColorUtil.getRGB('#fff'), [255, 255, 255], 'Should return rgb values for CSS hexa shorthand color');
    assert.deepEqual(ColorUtil.getRGB('#ffffff'), [255, 255, 255], 'Should return rgb values for CSS hexa color');
  });
  it('Should return the color luminance', () => {
    assert.equal(ColorUtil.luminance('#fff'), 1, 'Should be "1" for #fff');
    assert.equal(ColorUtil.luminance('#ffffff'), 1, 'Should be "1" for #ffffff');
    assert.equal(ColorUtil.luminance('#000'), 0, 'Should be "0" for #000');
    assert.equal(ColorUtil.luminance('#000000'), 0, 'Should be "0" for #000000');

    assert.equal(ColorUtil.luminance('#ccc').toFixed(1), 0.6, 'Should be around "0.6" for #ccc');

  });
});
