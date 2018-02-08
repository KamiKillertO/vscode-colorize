import { assert } from 'chai';

import { CSS_VARIABLES, SASS_LESS_VARIABLES, STYLUS_VARIABLES, DECLARATION_REGEXP } from '../../src/lib/variables/variables-extractor';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var:'.match(DECLARATION_REGEXP));
    assert.ok('$var-two:'.match(DECLARATION_REGEXP));
    assert.ok('$var-two       :'.match(DECLARATION_REGEXP));

    assert.ok('$normal-var:'.match(DECLARATION_REGEXP));
    assert.ok('$with-number1:'.match(DECLARATION_REGEXP));
    assert.ok('$with-letterA:'.match(DECLARATION_REGEXP));
    assert.ok('$with-dash-1:'.match(DECLARATION_REGEXP));
    assert.ok('$with-dash-A:'.match(DECLARATION_REGEXP));
    assert.ok('$with-underscore_B:'.match(DECLARATION_REGEXP));
    assert.ok('$with-underscore_2:'.match(DECLARATION_REGEXP));
    assert.ok('$colorA:'.match(DECLARATION_REGEXP));
    assert.ok('$a1:'.match(DECLARATION_REGEXP));

  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$var'.match(DECLARATION_REGEXP));
    assert.notOk('$ :'.match(DECLARATION_REGEXP));
    assert.notOk('$1a :'.match(DECLARATION_REGEXP));
  });

  // less
  it('Should match (less variables)', function () {
    assert.ok('@var:'.match(DECLARATION_REGEXP));
    assert.ok('@var-two:'.match(DECLARATION_REGEXP));
    assert.ok('@var-two       :'.match(DECLARATION_REGEXP));

    assert.ok('@normal-var:'.match(DECLARATION_REGEXP));
    assert.ok('@with-number1:'.match(DECLARATION_REGEXP));
    assert.ok('@with-letterA:'.match(DECLARATION_REGEXP));
    assert.ok('@with-dash-1:'.match(DECLARATION_REGEXP));
    assert.ok('@with-dash-A:'.match(DECLARATION_REGEXP));
    assert.ok('@with-underscore_B:'.match(DECLARATION_REGEXP));
    assert.ok('@with-underscore_2:'.match(DECLARATION_REGEXP));
    assert.ok('@colorA:'.match(DECLARATION_REGEXP));
    assert.ok('@a1:'.match(DECLARATION_REGEXP));
  });
  it('Should not match (less variables)', function () {
    assert.notOk('@var'.match(DECLARATION_REGEXP));
    assert.notOk('@ :'.match(DECLARATION_REGEXP));
    assert.notOk('@1a :'.match(DECLARATION_REGEXP));
  });

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('--var:'.match(DECLARATION_REGEXP));
    assert.ok('--var-two:'.match(DECLARATION_REGEXP));
    assert.ok('--var-:'.match(DECLARATION_REGEXP));
    assert.ok('--var--two:'.match(DECLARATION_REGEXP));
    assert.ok('--varTwo:'.match(DECLARATION_REGEXP));
    assert.ok('--varTwo       :'.match(DECLARATION_REGEXP));
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
    assert.ok('var-two      ='.match(DECLARATION_REGEXP));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('var'.match(DECLARATION_REGEXP));
    assert.notOk('-- ='.match(DECLARATION_REGEXP));
  });
});

describe('Test variables use regexp', function() {

  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var'.match(SASS_LESS_VARIABLES));
    assert.ok('$var-two'.match(SASS_LESS_VARIABLES));

    assert.ok('$normal-var'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-number1'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-letterA'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-dash-1'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-dash-A'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-underscore_2'.match(SASS_LESS_VARIABLES));
    assert.ok('$with-underscore_B'.match(SASS_LESS_VARIABLES));
    assert.ok('$a1'.match(SASS_LESS_VARIABLES));
  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$ '.match(SASS_LESS_VARIABLES));
    assert.notOk('$'.match(SASS_LESS_VARIABLES));
    assert.notOk('$1a'.match(SASS_LESS_VARIABLES));
  });

  // less
  it('Should match (less variables)', function () {
    assert.ok('@var'.match(SASS_LESS_VARIABLES));
    assert.ok('@var-two'.match(SASS_LESS_VARIABLES));

    assert.ok('@normal-var'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-number1'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-letterA'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-dash-1'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-dash-A'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-underscore_2'.match(SASS_LESS_VARIABLES));
    assert.ok('@with-underscore_B'.match(SASS_LESS_VARIABLES));
    assert.ok('@a1'.match(SASS_LESS_VARIABLES));
  });
  it('Should not match (less variables)', function () {
    assert.notOk('@'.match(SASS_LESS_VARIABLES));
    assert.notOk('@ '.match(SASS_LESS_VARIABLES));
    assert.notOk('@1a '.match(SASS_LESS_VARIABLES));
  });

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('var(--var)'.match(CSS_VARIABLES));
    assert.ok('var(--var-two)'.match(CSS_VARIABLES));
    assert.ok('var(--var-)'.match(CSS_VARIABLES));
    assert.ok('var(--var--two)'.match(CSS_VARIABLES));
    assert.ok('var(--varTwo)'.match(CSS_VARIABLES));
  });
  it('Should not match (css variables)', function () {
    assert.notOk('--var'.match(CSS_VARIABLES));
    assert.notOk('-- '.match(CSS_VARIABLES));
    assert.notOk('--'.match(CSS_VARIABLES));
    assert.notOk('var(--)'.match(CSS_VARIABLES));
    assert.notOk('var(-var)'.match(CSS_VARIABLES));
    assert.notOk('var(var)'.match(CSS_VARIABLES));
    assert.notOk('var()'.match(CSS_VARIABLES));
  });

  // stylus variables
  it('Should match (stylus variables)', function () {
    assert.ok('var'.match(STYLUS_VARIABLES));
    assert.ok('var-two'.match(STYLUS_VARIABLES));
    assert.ok('a'.match(STYLUS_VARIABLES));
    assert.ok('--a'.match(STYLUS_VARIABLES));
    assert.ok('-a'.match(STYLUS_VARIABLES));
    assert.ok('_a'.match(STYLUS_VARIABLES));
    assert.ok('$a'.match(STYLUS_VARIABLES));
    assert.ok('$'.match(STYLUS_VARIABLES));
  });
  it('Should not match (stylus variables)', function () {
    assert.notOk('--'.match(STYLUS_VARIABLES));
    assert.notOk('__'.match(STYLUS_VARIABLES));
    assert.notOk('120'.match(STYLUS_VARIABLES));
    assert.notOk('@'.match(STYLUS_VARIABLES));
    assert.notOk('1a'.match(STYLUS_VARIABLES)); // match ><
  });
});
