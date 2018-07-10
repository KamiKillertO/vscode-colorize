import { assert } from 'chai';

import { REGEXP } from '../../src/lib/colors/strategies/rgb-strategy';
import { regex_exec } from '../test-util';

describe('Test rgb(a) color Regex', () => {
  it('Should match a simple rgb color', function () {
    assert.equal(regex_exec('rgb(123,123,123)', REGEXP)[1], 'rgb(123,123,123)');
  });
  it('Should match a simple rgba color', function () {
    assert.equal(regex_exec('rgba(123,123,123, 0)', REGEXP)[1], 'rgba(123,123,123, 0)');
    assert.equal(regex_exec('rgba(123,123,123, 0.3)', REGEXP)[1], 'rgba(123,123,123, 0.3)');
    assert.equal(regex_exec('rgba(123,123,123, .3)', REGEXP)[1], 'rgba(123,123,123, .3)');
    assert.equal(regex_exec('rgba(123,123,123, 1)', REGEXP)[1], 'rgba(123,123,123, 1)');
    assert.equal(regex_exec('rgba(123,123,123, 1.0)', REGEXP)[1], 'rgba(123,123,123, 1.0)');
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('rgba(123,123,123, 1.1)', REGEXP));
    assert.isNull(regex_exec('rgb(,123,123)', REGEXP));
  });
  it('Should match inside a string', function() {
    assert.equal(regex_exec('"rgba(123,123,123, 1)"', REGEXP)[1], 'rgba(123,123,123, 1)');
    assert.equal(regex_exec('"rgb(123,123,123)"', REGEXP)[1], 'rgb(123,123,123)');
  });

  it('Should match with different characters at the end', function () {
    assert.equal(regex_exec('rgb(123,123,123) ', REGEXP)[1], 'rgb(123,123,123)');
    assert.equal(regex_exec('rgb(123,123,123),', REGEXP)[1], 'rgb(123,123,123)');
    assert.equal(regex_exec('rgb(123,123,123);', REGEXP)[1], 'rgb(123,123,123)');
    assert.equal(regex_exec('rgb(123,123,123)\n', REGEXP)[1], 'rgb(123,123,123)');
  });
});
