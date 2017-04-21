import { assert } from 'chai';

import { REGEXP } from '../../src/util/extractors/rgb-extractor';

describe('Test rgb(a) color Regex', () => {
  it('Should match a simple rgb color', function () {
    assert.ok('rgb(123,123,123)'.match(REGEXP));
  });
  it('Should match a simple rgba color', function () {
    assert.ok('rgba(123,123,123, 0)'.match(REGEXP));
    assert.ok('rgba(123,123,123, 0.3)'.match(REGEXP));
    assert.ok('rgba(123,123,123, .3)'.match(REGEXP));
    assert.ok('rgba(123,123,123, 1)'.match(REGEXP));
    assert.ok('rgba(123,123,123, 1.0)'.match(REGEXP));
  });
  it('Should not match', function () {
    assert.notOk('rgba(123,123,123, 1.1)'.match(REGEXP));
  });
  it('Sould match inside a string', function() {
    assert.ok('"rgba(123,123,123, 1)"'.match(REGEXP));
    assert.ok('"rgb(123,123,123)"'.match(REGEXP));
  });

  it('Should match with different characters at the end', function () {
    assert.ok('rgb(123,123,123) '.match(REGEXP));
    assert.ok('rgb(123,123,123),'.match(REGEXP));
    assert.ok('rgb(123,123,123);'.match(REGEXP));
    assert.ok('rgb(123,123,123)\n'.match(REGEXP));
  });
});
