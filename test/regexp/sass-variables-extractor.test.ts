import { assert } from 'chai';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/variables/extractors/sass-extractor';
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
});

describe('Test variables use regexp', function() {

  // Sass
  it('Should match (sass variables)', function () {
    assert.ok('$var'.match(REGEXP));
    assert.ok('$var-two'.match(REGEXP));

    assert.ok('$normal-var'.match(REGEXP));
    assert.ok('$with-number1'.match(REGEXP));
    assert.ok('$with-letterA'.match(REGEXP));
    assert.ok('$with-dash-1'.match(REGEXP));
    assert.ok('$with-dash-A'.match(REGEXP));
    assert.ok('$with-underscore_2'.match(REGEXP));
    assert.ok('$with-underscore_B'.match(REGEXP));
    assert.ok('$a1'.match(REGEXP));
  });
  it('Should not match (sass variables)', function () {
    assert.notOk('$ '.match(REGEXP));
    assert.notOk('$'.match(REGEXP));
    assert.notOk('$1a'.match(REGEXP));
  });
});
