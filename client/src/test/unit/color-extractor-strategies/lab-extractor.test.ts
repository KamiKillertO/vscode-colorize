import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../lib/colors/strategies/lab-strategy';
import { regex_exec } from '../../helper';

describe('Test lab color Regex', () => {
  [
    'lab(1 0.1143 0.045)',
    'lab(0.4 0.1143 0.045)',
    'lab(40.1% 0.1143 -0.045)',
    'lab(0.4 0.1143 45%)',
    'lab(40.1% 0.1143 -45%)',
    'lab(40.1% 11% 0.045)',
    'lab(40.1% -11% 0.045)',
    'lab(40.1% 0.1143 0.045)',
    'lab(0.4 -0.1143 0.045)',
    'lab(59.69% 0.1007 0.1191)',
    'lab(59.69% 0.1007 0.1191 / 0.5)',
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
      regex_exec('"lab(1 0.1143 0.045)"', REGEXP)[1],
      'lab(1 0.1143 0.045)',
    );
    assert.equal(
      regex_exec('"lab(1 0.1143 0.045)"', REGEXP)[1],
      'lab(1 0.1143 0.045)',
    );
  });

  it('Should match with different characters at the end', function () {
    const color_str = 'lab(1 0.1143 0.045)';
    assert.equal(regex_exec(`${color_str} `, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str},`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str};`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}\n`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str})`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}}`, REGEXP)[1], color_str);
    assert.equal(regex_exec(`${color_str}<`, REGEXP)[1], color_str);
  });
});
