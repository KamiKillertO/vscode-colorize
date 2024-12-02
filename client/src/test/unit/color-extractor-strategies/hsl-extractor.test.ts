import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../lib/colors/strategies/hsl-strategy';
import HSLStrategy from '../../../lib/colors/strategies/hsl-strategy';
import type Color from '../../../lib/colors/color';
import { regex_exec } from '../../helper';

describe('Test hsl(a) color Regex', () => {
  it('Should match new hsl syntax', function () {
    assert.equal(
      regex_exec('hsl(120deg 75% 25%)', REGEXP)[1],
      'hsl(120deg 75% 25%)',
    );
    assert.equal(
      regex_exec('hsl(120 75 25)', REGEXP)[1],
      'hsl(120 75 25)',
    ); /* deg and % units are optional */
    assert.equal(
      regex_exec('hsl(120deg 75% 25% / 60%)', REGEXP)[1],
      'hsl(120deg 75% 25% / 60%)',
    );
    assert.equal(
      regex_exec('hsl(120deg 75% 25)', REGEXP)[1],
      'hsl(120deg 75% 25)',
    );
    assert.equal(
      regex_exec('hsl(120deg 75 25%)', REGEXP)[1],
      'hsl(120deg 75 25%)',
    );
    assert.equal(regex_exec('hsl(120 75% 25%)', REGEXP)[1], 'hsl(120 75% 25%)');
    // assert.equal(
    //   regex_exec('hsl(none 75% 25%)', REGEXP)[1],
    //   'hsl(120deg 75% 25% / 60%)',
    // ); // Not supported yet
  });
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

describe('Extract color', () => {
  (
    [
      {
        input: 'hsl(120deg 75% 25%)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(120 75 25)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(120deg 75% 25% / 60%)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 0.6,
        },
      },
      {
        input: 'hsl(120deg 75% 25)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(360deg 75% 25)',
        expected: {
          rgb: [112, 16, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(520deg 75% 25)',
        expected: {
          rgb: [16, 112, 80],
          alpha: 1,
        },
      },
      {
        input: 'hsl(120deg 75 25%)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(120 75% 25%)',
        expected: {
          rgb: [16, 112, 16],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200, 10%, 10%)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200, 10%, 10%, 0)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 0,
        },
      },
      {
        input: 'hsla(200, 10%, 10%, 0.3)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 0.3,
        },
      },
      {
        input: 'hsla(200, 10%, 10%, .3)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 0.3,
        },
      },
      {
        input: 'hsla(200, 10%, 10%, 1)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200, 10%, 10%, 1.0)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200.1, 10%, 10%)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200, 10.1%, 10%)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200, 10%, 10.1%)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200, 10%, 10.1111111%)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(200.1, 10.1%, 10.1%)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsl(.1, 10.1%, 10.1%)',
        expected: {
          rgb: [28, 23, 23],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200.1, 10%, 10%, 1)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200, 10.1%, 10%, 1)',
        expected: {
          rgb: [23, 26, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200, 10%, 10.1%, 1)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200, 10%, 10.1%, 1.0)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(200.1, 10.1%, 10.1%, 1)',
        expected: {
          rgb: [23, 27, 28],
          alpha: 1,
        },
      },
      {
        input: 'hsla(.1, 10.1%, 10.1%, 1)',
        expected: {
          rgb: [28, 23, 23],
          alpha: 1,
        },
      },
      {
        input: 'hsl(0.3turn 60% 45% / .7)',
        expected: {
          rgb: [74, 184, 46],
          alpha: 0.7,
        },
      },
      {
        input: 'hsl(12.3turn 60% 45% / .7)',
        expected: {
          rgb: [74, 184, 46],
          alpha: 0.7,
        },
      },
      {
        input: 'hsl(1turn 60% 45% / .7)',
        expected: {
          rgb: [184, 46, 46],
          alpha: 0.7,
        },
      },
      {
        input: 'hsl(12turn 60% 45% / .7)',
        expected: {
          rgb: [184, 46, 46],
          alpha: 0.7,
        },
      },
    ] satisfies Array<{
      input: string;
      expected: {
        rgb: [number, number, number];
        alpha: number;
      };
    }>
  ).forEach((test) => {
    it(`Should correctly extract '${test.input}'`, function () {
      const color = HSLStrategy.extractColor(test.input) as Color;
      assert.deepEqual(color.rgb, test.expected.rgb);
      assert.deepEqual(color.alpha, test.expected.alpha);
    });
  });
});
