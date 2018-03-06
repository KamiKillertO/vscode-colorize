import { assert } from 'chai';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/variables/strategies/stylus-strategy';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok('var='.match(DECLARATION_REGEXP));
    assert.ok('var-two='.match(DECLARATION_REGEXP));
    assert.ok('var-two      ='.match(DECLARATION_REGEXP));
    assert.ok('--a='.match(DECLARATION_REGEXP));
    assert.ok('--a1='.match(DECLARATION_REGEXP));
    assert.ok('-a='.match(DECLARATION_REGEXP));
    assert.ok('_a='.match(DECLARATION_REGEXP));
    assert.ok('$a='.match(DECLARATION_REGEXP));
    assert.ok('$='.match(DECLARATION_REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('var'.match(DECLARATION_REGEXP));
    assert.notOk('-- ='.match(DECLARATION_REGEXP));
    assert.notOk('__='.match(REGEXP));
    assert.notOk('120='.match(REGEXP));
    assert.notOk('@='.match(REGEXP));
    assert.notOk('1a='.match(REGEXP));
  });
});

describe('Test variables use regexp', function() {
  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok('var'.match(REGEXP));
    assert.ok('var-two'.match(REGEXP));
    assert.ok('a'.match(REGEXP));
    assert.ok('--a'.match(REGEXP));
    assert.ok('-a'.match(REGEXP));
    assert.ok('_a'.match(REGEXP));
    assert.ok('$a'.match(REGEXP));
    assert.ok('$'.match(REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('--'.match(REGEXP));
    assert.notOk('__'.match(REGEXP));
    assert.notOk('120'.match(REGEXP));
    assert.notOk('@'.match(REGEXP));
    assert.notOk('1a'.match(REGEXP));
  });
});
