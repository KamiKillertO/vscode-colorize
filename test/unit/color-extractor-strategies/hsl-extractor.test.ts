import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../src/lib/colors/strategies/hsl-strategy';
import { regex_exec } from '../../test-util';

describe('Test hsl(a) color Regex', () => {
  it('Should match a simple hsl color', function () {
    assert.equal(
      regex_exec('hsl(200, 10%, 10%)', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
  });
  it('Should match a simple hsla color', function () {
    assert.equal(
      regex_exec('hsla(200, 10%, 10%, 0)', REGEXP)[1],
      'hsla(200, 10%, 10%, 0)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10%, 0.3)', REGEXP)[1],
      'hsla(200, 10%, 10%, 0.3)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10%, .3)', REGEXP)[1],
      'hsla(200, 10%, 10%, .3)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10%, 1)', REGEXP)[1],
      'hsla(200, 10%, 10%, 1)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10%, 1.0)', REGEXP)[1],
      'hsla(200, 10%, 10%, 1.0)',
    );
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('hsla(123, 100%, 1%, 1.1)', REGEXP));
    assert.isNull(regex_exec('hsl(123, 100%, 1)', REGEXP));
    assert.isNull(regex_exec('hsl(123, 100, 1%)', REGEXP));
    assert.isNull(regex_exec('hsl(123%, 100%, 1%)', REGEXP));
  });
  it('Should match inside a string', function () {
    assert.equal(
      regex_exec('"hsl(123, 10%, 10%)"', REGEXP)[1],
      'hsl(123, 10%, 10%)',
    );
    assert.equal(
      regex_exec('"hsla(123, 10%, 10%, 0)"', REGEXP)[1],
      'hsla(123, 10%, 10%, 0)',
    );
  });

  it('Should match with different characters at the end', function () {
    assert.equal(
      regex_exec('hsl(200, 10%, 10%) ', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%),', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%);', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%)\n', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%))', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%)}', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10%)<', REGEXP)[1],
      'hsl(200, 10%, 10%)',
    );
  });

  it('Should accept dot values (hsl)', function () {
    assert.equal(
      regex_exec('hsl(200.1, 10%, 10%) ', REGEXP)[1],
      'hsl(200.1, 10%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10.1%, 10%),', REGEXP)[1],
      'hsl(200, 10.1%, 10%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10.1%);', REGEXP)[1],
      'hsl(200, 10%, 10.1%)',
    );
    assert.equal(
      regex_exec('hsl(200, 10%, 10.1111111%);', REGEXP)[1],
      'hsl(200, 10%, 10.1111111%)',
    );
    assert.equal(
      regex_exec('hsl(200.1, 10.1%, 10.1%)\n', REGEXP)[1],
      'hsl(200.1, 10.1%, 10.1%)',
    );
    assert.equal(
      regex_exec('hsl(.1, 10.1%, 10.1%)\n', REGEXP)[1],
      'hsl(.1, 10.1%, 10.1%)',
    );
  });

  it('Should accept dot values (hsla)', function () {
    assert.equal(
      regex_exec('hsla(200.1, 10%, 10%, 1) ', REGEXP)[1],
      'hsla(200.1, 10%, 10%, 1)',
    );
    assert.equal(
      regex_exec('hsla(200, 10.1%, 10%, 1),', REGEXP)[1],
      'hsla(200, 10.1%, 10%, 1)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10.1%, 1);', REGEXP)[1],
      'hsla(200, 10%, 10.1%, 1)',
    );
    assert.equal(
      regex_exec('hsla(200, 10%, 10.1%, 1.0);', REGEXP)[1],
      'hsla(200, 10%, 10.1%, 1.0)',
    );
    assert.equal(
      regex_exec('hsla(200.1, 10.1%, 10.1%, 1)\n', REGEXP)[1],
      'hsla(200.1, 10.1%, 10.1%, 1)',
    );
    assert.equal(
      regex_exec('hsla(.1, 10.1%, 10.1%, 1)\n', REGEXP)[1],
      'hsla(.1, 10.1%, 10.1%, 1)',
    );
  });
});
