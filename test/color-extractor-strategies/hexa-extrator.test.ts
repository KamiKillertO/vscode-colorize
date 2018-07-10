import { assert } from 'chai';

import { REGEXP } from '../../src/lib/colors/strategies/hexa-strategy';
import { regex_exec } from '../test-util';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test CSS hexa shorthand color Regex', () => {
  it('Should match color with only integer', function () {
    assert.equal(regex_exec('#000', REGEXP)[1], '#000');
  });
  it('Should match color with letters and integers', function () {
    assert.equal(regex_exec('#f0a', REGEXP)[1], '#f0a');
  });
  it('Should match color with only letters', function () {
    assert.equal(regex_exec('#fff', REGEXP)[1], '#fff');
  });
  it('Regex should not care about the case', function () {
    assert.equal(regex_exec('#Abc', REGEXP)[1], '#Abc');
  });
  it('Should match inside a string', function() {
    assert.equal(regex_exec('"#Abc"', REGEXP)[1], '#Abc');
  });
  it('Should accept accept an alpha value', function() {
    assert.equal(regex_exec('#0000', REGEXP)[1], '#0000');
  });
  it('Should match with different characters at the end', function () {
    assert.equal(regex_exec('#Abc', REGEXP)[1], '#Abc');
    assert.equal(regex_exec('#Abc ', REGEXP)[1], '#Abc');
    assert.equal(regex_exec('#Abc,', REGEXP)[1], '#Abc');
    assert.equal(regex_exec('#Abc;', REGEXP)[1], '#Abc');
    assert.equal(regex_exec('#Abc\n', REGEXP)[1], '#Abc');
    assert.equal(regex_exec('#Abc)\n', REGEXP)[1], '#Abc');
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('#AbG', REGEXP));
    assert.isNull(regex_exec('#AbcG', REGEXP));
    assert.isNull(regex_exec('#Ab', REGEXP));
  });
});
describe('Test CSS hexa color Regex', () => {
  it('Should match color with only integer', function () {
    assert.equal(regex_exec('#000000', REGEXP)[1], '#000000');
  });
  it('Should match color with letters and integers', function () {
    assert.equal(regex_exec('#f0f0f0', REGEXP)[1], '#f0f0f0');
  });
  it('Should match color with only letters', function () {
    assert.equal(regex_exec('#ffffff', REGEXP)[1], '#ffffff');
  });
  it('Regex should not care about the case', function () {
    assert.equal(regex_exec('#Abc012', REGEXP)[1], '#Abc012');
  });
  it('Sould match inside a string', function() {
    assert.equal(regex_exec('"#ffffff"', REGEXP)[1], '#ffffff');
  });
  it('Should match with different characters at the end', function () {
    assert.equal(regex_exec('#ffffff ', REGEXP)[1], '#ffffff');
    assert.equal(regex_exec('#ffffff,', REGEXP)[1], '#ffffff');
    assert.equal(regex_exec('#ffffff;', REGEXP)[1], '#ffffff');
    assert.equal(regex_exec('#ffffff\n', REGEXP)[1], '#ffffff');
    assert.equal(regex_exec('#ffffff)', REGEXP)[1], '#ffffff');
  });
  it('Should accept accept an alpha value', function() {
    assert.equal(regex_exec('#00000000', REGEXP)[1], '#00000000');
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('#fffffg', REGEXP));
    assert.isNull(regex_exec('#ffffffg', REGEXP));
    assert.isNull(regex_exec('#fffff', REGEXP));
    assert.isNull(regex_exec('#fffffff', REGEXP));
  });
});
describe('Test CSS hexa (with 0x prefix) color Regex', () => {
  it('Should match color with only integer', function () {
    assert.equal(regex_exec('0x000000', REGEXP)[1], '0x000000');
  });
  it('Should match color with letters and integers', function () {
    assert.equal(regex_exec('0xf0f0f0', REGEXP)[1], '0xf0f0f0');
  });
  it('Should match color with only letters', function () {
    assert.equal(regex_exec('0xffffff', REGEXP)[1], '0xffffff');
  });
  it('Regex should not care about the case', function () {
    assert.equal(regex_exec('0xAbc012', REGEXP)[1], '0xAbc012');
  });
  it('Sould match inside a string', function() {
    assert.equal(regex_exec('"0xffffff"', REGEXP)[1], '0xffffff');
  });
  it('Should match with different characters at the end', function () {
    assert.equal(regex_exec('0xffffff ', REGEXP)[1], '0xffffff');
    assert.equal(regex_exec('0xffffff,', REGEXP)[1], '0xffffff');
    assert.equal(regex_exec('0xffffff;', REGEXP)[1], '0xffffff');
    assert.equal(regex_exec('0xffffff\n', REGEXP)[1], '0xffffff');
    assert.equal(regex_exec('0xffffff)', REGEXP)[1], '0xffffff');
  });
  it('Should accept accept an alpha value', function() {
    assert.equal(regex_exec('0x00000000', REGEXP)[1], '0x00000000');
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('0xfffffg', REGEXP));
    assert.isNull(regex_exec('0xffffffg', REGEXP));
    assert.isNull(regex_exec('0xfffff', REGEXP));
    assert.isNull(regex_exec('0xfffffff', REGEXP));
  });
});
