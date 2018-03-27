import { assert } from 'chai';

import { REGEXP } from '../../src/lib/colors/strategies/browser-strategy';

// Defines a Mocha test suite to group tests of similar kind together
describe('Test browser predefined color Regex', () => {

  it('white should match', function () {
    assert.ok(' white'.match(REGEXP));
    assert.ok(',white'.match(REGEXP));
    assert.ok('(white'.match(REGEXP));
    assert.ok(':white'.match(REGEXP));
  });
  it('Should not match inside a string', function() {
    assert.notOk('"white""'.match(REGEXP));
  });
  it('Should not match without a valid char before', function() {
    assert.notOk('awhite'.match(REGEXP));
    assert.notOk('-white'.match(REGEXP));
    assert.notOk('$white'.match(REGEXP));
  });

  it('Should match with different characters at the end', function () {
    assert.ok(' white'.match(REGEXP));
    assert.ok(' white '.match(REGEXP));
    assert.ok(' white,'.match(REGEXP));
    assert.ok(' white;'.match(REGEXP));
    assert.ok(' white\n'.match(REGEXP));
    assert.ok(' white)\n'.match(REGEXP));
  });
  it('Should not match', function () {
    assert.notOk('white-'.match(REGEXP));
    // assert.notOk('-white'.match(REGEXP)); //?
  });
});
