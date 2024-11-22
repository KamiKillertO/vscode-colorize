import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../src/lib/colors/strategies/oklch-strategy';
import { regex_exec } from '../../test-util';

describe('Test oklab color Regex', () => {
  [
    'oklch(40.1% 0.123 21.57)',
    'oklch(59.69% 0.156 49.77)',
    'oklch(59.69% 0.156 49.77 / .5)',
    'oklch(50% 100% 20deg)',
    'oklch(50% 50% 20deg)',
    'oklch(50% 25% 20deg)',
    'oklch(50% 2% 20deg)',
    'oklch(1 2% 20deg)',
  ].forEach((str) => {
    it(`Should match ${str}`, function () {
      assert.equal(regex_exec(str, REGEXP)[1], str);
    });
  });

  // it('Should not match', function () {
  //   assert.isNull(regex_exec('hsla(123, 100%, 1%, 1.1)', REGEXP));
  //   assert.isNull(regex_exec('hsl(123, 100%, 1)', REGEXP));
  //   assert.isNull(regex_exec('hsl(123, 100, 1%)', REGEXP));
  //   assert.isNull(regex_exec('hsl(123%, 100%, 1%)', REGEXP));
  // });
  it('Should match inside a string', function () {
    assert.equal(
      regex_exec('"oklch(40.1% 0.123 21.57)"', REGEXP)[1],
      'oklch(40.1% 0.123 21.57)',
    );
    assert.equal(
      regex_exec('"oklch(40.1% 0.123 21.57)"', REGEXP)[1],
      'oklch(40.1% 0.123 21.57)',
    );
  });

  it('Should match with different characters at the end', function () {
    const color_str = 'oklch(40.1% 0.123 21.57)';
    assert.equal(regex_exec(`${color_str} `, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str},`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str};`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}\n`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str})`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}}`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}<`, REGEXP)[1], color_str);
  });
});
