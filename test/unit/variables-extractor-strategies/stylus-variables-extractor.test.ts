import { assert } from 'chai';
import { describe, it } from 'mocha';

import {
  REGEXP,
  DECLARATION_REGEXP,
} from '../../../src/lib/variables/strategies/stylus-strategy';
import { regex_exec } from '../../test-util';
// Defines a Mocha test suite to group tests of similar kind together

describe('Test variables declaration Regex', () => {
  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.equal(
      regex_exec('var=', DECLARATION_REGEXP)[1],
      'var',
      '"var=" should match',
    );
    assert.equal(
      regex_exec('var-two=', DECLARATION_REGEXP)[1],
      'var-two',
      '"var-two=" should match',
    );
    assert.equal(
      regex_exec('var-1=', DECLARATION_REGEXP)[1],
      'var-1',
      '"var-1=" should match',
    );
    assert.equal(
      regex_exec('var-two-three=', DECLARATION_REGEXP)[1],
      'var-two-three',
      '"var-two-tree=" should match',
    );
    assert.equal(
      regex_exec('var_two=', DECLARATION_REGEXP)[1],
      'var_two',
      '"var_two=" should match',
    );
    assert.equal(
      regex_exec('var_two_three=', DECLARATION_REGEXP)[1],
      'var_two_three',
      '"var-two-tree=" should match',
    );
    assert.equal(
      regex_exec('var--two=', DECLARATION_REGEXP)[1],
      'var--two',
      '"var---two=" should match',
    );
    assert.equal(
      regex_exec('var--two--three=', DECLARATION_REGEXP)[1],
      'var--two--three',
      '"var-two-tree=" should match',
    );
    assert.equal(
      regex_exec('var__two=', DECLARATION_REGEXP)[1],
      'var__two',
      '"var__two=" should match',
    );
    assert.equal(
      regex_exec('var__two__three=', DECLARATION_REGEXP)[1],
      'var__two__three',
      '"var-two-tree=" should match',
    );
    assert.equal(
      regex_exec('var-two      =', DECLARATION_REGEXP)[1],
      'var-two',
      '"var-two=" should match',
    );
    assert.equal(
      regex_exec('a=', DECLARATION_REGEXP)[1],
      'a',
      '"a" should match',
    );
    assert.equal(
      regex_exec('_=', DECLARATION_REGEXP)[1],
      '_',
      '"_" should match',
    );
    assert.equal(
      regex_exec('__=', DECLARATION_REGEXP)[1],
      '__',
      '"__" should match',
    );
    assert.equal(
      regex_exec('--a=', DECLARATION_REGEXP)[1],
      '--a',
      '"--a==" should match',
    );
    assert.equal(
      regex_exec('--a1=', DECLARATION_REGEXP)[1],
      '--a1',
      '"--a1=" should match',
    );
    assert.equal(
      regex_exec('-a=', DECLARATION_REGEXP)[1],
      '-a',
      '"-a=" should match',
    );
    assert.equal(
      regex_exec('_a=', DECLARATION_REGEXP)[1],
      '_a',
      '"_a=" should match',
    );
    assert.equal(
      regex_exec('$a=', DECLARATION_REGEXP)[1],
      '$a',
      '"$a=" should match',
    );
    assert.equal(
      regex_exec('$=', DECLARATION_REGEXP)[1],
      '$',
      '"$=" should match',
    );
  });
  it('Should not match (stylus variables)', function () {
    assert.isNull(
      regex_exec('var', DECLARATION_REGEXP),
      '"var" is not a valid variable declaration',
    );
    // assert.isNull(regex_exec('-- =', DECLARATION_REGEXP), '"-- =" is not a valid variable declaration'); // match (" ") but not the strategy get rid of this
    assert.isNull(
      regex_exec('--=', DECLARATION_REGEXP),
      '"--=" is not a valid variable declaration',
    );
    assert.isNull(
      regex_exec('120=', DECLARATION_REGEXP),
      '"120=" is not a valid variable declaration',
    );
    assert.isNull(
      regex_exec('@=', DECLARATION_REGEXP),
      '"@=" is not a valid variable declaration',
    );
    assert.isNull(
      regex_exec('@a=', DECLARATION_REGEXP),
      '"@a=" is not a valid variable declaration',
    );
    assert.isNull(
      regex_exec('1a=', DECLARATION_REGEXP),
      '"1a=" is not a valid variable declaration',
    );
    // assert.isNull(regex_exec(' =', DECLARATION_REGEXP), '" =" is not a valid variable declaration'); // match (" ") but not the strategy get rid of this
  });
});

describe('Test variables use regexp', function () {
  // stylus variables

  it('Should match (stylus variables)', function () {
    // should check the extraction
    assert.equal(regex_exec('var', REGEXP)[2], 'var', '"var" should match');
    assert.equal(
      regex_exec('var-two', REGEXP)[2],
      'var-two',
      '"var-two" should match',
    );
    assert.equal(
      regex_exec('var--two', REGEXP)[2],
      'var--two',
      '"var--two" should match',
    );
    assert.equal(
      regex_exec('var-one-two', REGEXP)[2],
      'var-one-two',
      '"var-one-two" should match',
    );
    assert.equal(
      regex_exec('var--one--two', REGEXP)[2],
      'var--one--two',
      '"var--one--two" should match',
    );
    assert.equal(regex_exec('a', REGEXP)[2], 'a', '"a" should match');
    assert.equal(regex_exec('_', REGEXP)[2], '_', '"_" should match');
    assert.equal(regex_exec('__', REGEXP)[2], '__', '"_" should match');
    assert.equal(regex_exec('a1', REGEXP)[2], 'a1', '"a" should match');
    assert.equal(regex_exec('--a', REGEXP)[2], '--a', '"--a" should match');
    assert.equal(regex_exec('-a', REGEXP)[2], '-a', '"-a" should match');
    assert.equal(regex_exec('_a', REGEXP)[2], '_a', '"_a" should match');
    assert.equal(regex_exec('$a', REGEXP)[2], '$a', '"$a" should match');
    assert.equal(regex_exec('$', REGEXP)[2], '$', '"$" should match');
  });
  it('Should not match (stylus variables)', function () {
    assert.isNull(regex_exec('--', REGEXP), '"--" is not a valid variable');
    assert.isNull(regex_exec('120', REGEXP), '"--" is not a valid variable');
    assert.isNull(regex_exec('@', REGEXP), '"--" is not a valid variable');
    assert.isNull(regex_exec('1a', REGEXP), '"--" is not a valid variable');
  });
});
