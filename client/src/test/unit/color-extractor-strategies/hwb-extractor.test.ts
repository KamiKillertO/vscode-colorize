import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../lib/colors/strategies/hwb-strategy';
import { regex_exec } from '../../helper';

describe('Test hwb color Regex', () => {
  [
    'hwb(12 50% 0%)',
    'hwb(50deg 30% 40%)',
    'hwb(0.5turn 10% 0% / .5)',
    'hwb(0 100% 0% / 50%)',
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
    assert.equal(regex_exec('"hwb(12 50% 0%)"', REGEXP)[1], 'hwb(12 50% 0%)');
    assert.equal(regex_exec('"hwb(12 50% 0%)"', REGEXP)[1], 'hwb(12 50% 0%)');
  });

  it('Should match with different characters at the end', function () {
    const color_str = 'hwb(12 50% 0%)';
    assert.equal(regex_exec(`${color_str} `, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str},`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str};`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}\n`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str})`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}}`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}<`, REGEXP)[1], color_str);
  });
});
