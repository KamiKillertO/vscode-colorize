import { assert } from 'chai';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/extractors/variables-extractor';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var:'.match(DECLARATION_REGEXP));
    assert.ok('$var-two:'.match(DECLARATION_REGEXP));
  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$var'.match(DECLARATION_REGEXP));
    assert.notOk('$ :'.match(DECLARATION_REGEXP));
  });

  // less
  it('Should match (less variables)', function () {
    assert.ok('@var:'.match(DECLARATION_REGEXP));
    assert.ok('@var-two:'.match(DECLARATION_REGEXP));
  });
  it('Should not match (less variables)', function () {
    assert.notOk('@var'.match(DECLARATION_REGEXP));
    assert.notOk('@ :'.match(DECLARATION_REGEXP));
  });

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('--var:'.match(DECLARATION_REGEXP));
    assert.ok('--var-two:'.match(DECLARATION_REGEXP));
    assert.ok('--var-:'.match(DECLARATION_REGEXP));
    assert.ok('--var--two:'.match(DECLARATION_REGEXP));
    assert.ok('--varTwo:'.match(DECLARATION_REGEXP));
  });
  it('Should not match (css variables)', function () {
    assert.notMatch('--var', DECLARATION_REGEXP);
    assert.notMatch('-- :', DECLARATION_REGEXP);
    assert.notMatch('-var:', DECLARATION_REGEXP);
    assert.notMatch(':', DECLARATION_REGEXP);
  });

  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok('var='.match(DECLARATION_REGEXP));
    assert.ok('var-two='.match(DECLARATION_REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('var'.match(DECLARATION_REGEXP));
    assert.notOk('-- ='.match(DECLARATION_REGEXP));
  });
});

describe('Test variables use regexp', function() {

  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var'.match(REGEXP));
    assert.ok('$var-two'.match(REGEXP));
  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$ '.match(REGEXP));
    assert.notOk('$'.match(REGEXP));
  });

  // less
  it('Should match (less variables)', function () {
    assert.ok('@var'.match(REGEXP));
    assert.ok('@var-two'.match(REGEXP));
  });
  it('Should not match (less variables)', function () {
    assert.notOk('@'.match(REGEXP));
    assert.notOk('@ '.match(REGEXP));
  });

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('var(--var)'.match(REGEXP));
    assert.ok('var(--var-two)'.match(REGEXP));
    assert.ok('var(--var-)'.match(REGEXP));
    assert.ok('var(--var--two)'.match(REGEXP));
    assert.ok('var(--varTwo)'.match(REGEXP));
  });
  it('Should not match (css variables)', function () {
    assert.notOk('--var'.match(REGEXP));
    assert.notOk('-- '.match(REGEXP));
    assert.notOk('--'.match(REGEXP));
    assert.notOk('var(--)'.match(REGEXP));
    assert.notOk('var(-var)'.match(REGEXP));
    assert.notOk('var(var)'.match(REGEXP));
    assert.notOk('var()'.match(REGEXP));
  });

  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok(' var'.match(REGEXP));
    assert.ok(' var-two'.match(REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('var'.match(REGEXP));
    assert.notOk('--'.match(REGEXP));
  });
});
