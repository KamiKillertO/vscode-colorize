import { assert } from 'chai';

import { REGEXP } from '../../src/lib/extractors/variables-extractor';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test CSS hexa shorthand color Regex', () => {

  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var:'.match(REGEXP));
    assert.ok('$var-two:'.match(REGEXP));
  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$var'.match(REGEXP));
    assert.notOk('$ :'.match(REGEXP));
  });

  // less
  it('Should match (less variables)', function () {
    assert.ok('@var:'.match(REGEXP));
    assert.ok('@var-two:'.match(REGEXP));
  });
  it('Should not match (less variables)', function () {
    assert.notOk('@var'.match(REGEXP));
    assert.notOk('@ :'.match(REGEXP));
  });

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('--var:'.match(REGEXP));
    assert.ok('--var-two:'.match(REGEXP));
  });
  it('Should not match (css variables)', function () {
    assert.notOk('--var'.match(REGEXP));
    assert.notOk('-- :'.match(REGEXP));
  });

  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok('var='.match(REGEXP));
    assert.ok('var-two='.match(REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('var'.match(REGEXP));
    assert.notOk('-- ='.match(REGEXP));
  });
});
