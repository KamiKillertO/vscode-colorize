import { assert } from 'chai';

import { HEXA_COLOR, RGB_COLOR} from '../src/color-regex';

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
describe("Test rgb(a) color Regex", () => {
  it('Should match a simple rgb color', function () {
    assert.ok('rgb(123,123,123)'.match(RGB_COLOR));
  });
  it('Should match a simple rgba color', function () {
    assert.ok('rgba(123,123,123, 0)'.match(RGB_COLOR));
    assert.ok('rgba(123,123,123, 0.3)'.match(RGB_COLOR));
    assert.ok('rgba(123,123,123, 1)'.match(RGB_COLOR));
  });

  it('Should match with different characters at the end', function () {
    assert.ok('rgb(123,123,123) '.match(RGB_COLOR));
    assert.ok('rgb(123,123,123),'.match(RGB_COLOR));
    assert.ok('rgb(123,123,123);'.match(RGB_COLOR));
    assert.ok('rgb(123,123,123)\n'.match(RGB_COLOR));
  });
});
