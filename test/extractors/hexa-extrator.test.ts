import { assert } from 'chai';

import { REGEXP } from '../../src/util/extractors/hexa-extractor';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test CSS hexa shorthand color Regex', () => {
  it('Should match color with only integer', function () {
    assert.ok('#000'.match(REGEXP));
  });
  it('Should match color with letters and integers', function () {
    assert.ok('#f0a'.match(REGEXP));
  });
  it('Should match color with only letters', function () {
    assert.ok('#fff'.match(REGEXP));
  });
  it('Regex should not care about the case', function () {
    assert.ok('#Abc'.match(REGEXP));
  });
  it('Sould match inside a string', function() {
    assert.ok('"#Abc"'.match(REGEXP));
  });
  it('Should match with different characters at the end', function () {
    assert.ok('#Abc'.match(REGEXP));
    assert.ok('#Abc '.match(REGEXP));
    assert.ok('#Abc,'.match(REGEXP));
    assert.ok('#Abc;'.match(REGEXP));
    assert.ok('#Abc\n'.match(REGEXP));
    assert.ok('#Abc)\n'.match(REGEXP));
  });
  it('Should not match', function () {
    assert.notOk('#AbG'.match(REGEXP));
    assert.notOk('#AbcG'.match(REGEXP));
    assert.notOk('#Ab'.match(REGEXP));
  });
});
describe('Test CSS hexa color Regex', () => {
  it('Should match color with only integer', function () {
    assert.ok('#000000'.match(REGEXP));
  });
  it('Should match color with letters and integers', function () {
    assert.ok('#f0f0f0'.match(REGEXP));
  });
  it('Should match color with only letters', function () {
    assert.ok('#ffffff'.match(REGEXP));
  });
  it('Regex should not care about the case', function () {
    assert.ok('#Abc012'.match(REGEXP));
  });
  it('Sould match inside a string', function() {
    assert.ok('"#ffffff"'.match(REGEXP));
  });
  it('Should match with different characters at the end', function () {
    assert.ok('#ffffff '.match(REGEXP));
    assert.ok('#ffffff,'.match(REGEXP));
    assert.ok('#ffffff;'.match(REGEXP));
    assert.ok('#ffffff\n'.match(REGEXP));
    assert.ok('#ffffff)'.match(REGEXP));
  });
  it('Should not match', function () {
    assert.notOk('#fffffg'.match(REGEXP));
    assert.notOk('#ffffffg'.match(REGEXP));
    assert.notOk('#fffff'.match(REGEXP));
  });
});
