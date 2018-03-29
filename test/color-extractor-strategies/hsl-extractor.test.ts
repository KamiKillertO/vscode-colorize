import { assert } from 'chai';

import { REGEXP } from '../../src/lib/colors/strategies/hsl-strategy';

describe('Test hsl(a) color Regex', () => {
  it('Should match a simple hsl color', function () {
    assert.ok('hsl(200,10%,10%)'.match(REGEXP));
  });
  it('Should match a simple hsla color', function () {
    assert.ok('hsla(200,10%,10%, 0)'.match(REGEXP));
    assert.ok('hsla(200,10%,10%, 0.3)'.match(REGEXP));
    assert.ok('hsla(200,10%,10%, .3)'.match(REGEXP));
    assert.ok('hsla(200,10%,10%, 1)'.match(REGEXP));
    assert.ok('hsla(200,10%,10%, 1.0)'.match(REGEXP));
  });
  it('Should not match', function () {
    assert.notOk('hsla(123,100%,1%,1.1)'.match(REGEXP));
  });
  it('Should match inside a string', function() {
    assert.ok('"hsl(123,10%,10%)"'.match(REGEXP));
    assert.ok('"hsla(123,10%,10%,0)"'.match(REGEXP));
  });

  it('Should match with different characters at the end', function () {
    assert.ok('hsl(200,10%,10%) '.match(REGEXP));
    assert.ok('hsl(200,10%,10%),'.match(REGEXP));
    assert.ok('hsl(200,10%,10%);'.match(REGEXP));
    assert.ok('hsl(200,10%,10%)\n'.match(REGEXP));
  });
});
