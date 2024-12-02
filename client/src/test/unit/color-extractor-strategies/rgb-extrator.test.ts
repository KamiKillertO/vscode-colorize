import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP } from '../../../lib/colors/strategies/rgb-strategy';
import RGBStrategy from '../../../lib/colors/strategies/rgb-strategy';
import type Color from '../../../lib/colors/color';
import { regex_exec } from '../../helper';

describe('Test rgb(a) color Regex', () => {
  it('Should match the new syntax', function () {
    assert.equal(regex_exec('rgb(255 255 255)', REGEXP)[1], 'rgb(255 255 255)');
    assert.equal(regex_exec('rgb(2% 13% 255)', REGEXP)[1], 'rgb(2% 13% 255)');
    assert.equal(
      regex_exec('rgb(255 255 255 / 50%)', REGEXP)[1],
      'rgb(255 255 255 / 50%)',
    );
    assert.equal(regex_exec('rgba(0 255 255)', REGEXP)[1], 'rgba(0 255 255)');
    assert.equal(
      regex_exec('rgba(0 255 255 / 50)', REGEXP)[1],
      'rgba(0 255 255 / 50)',
    );

    assert.equal(
      regex_exec('rgba(.1 25.5 2.55 / 50)', REGEXP)[1],
      'rgba(.1 25.5 2.55 / 50)',
    );
  });
  it('Should match a simple rgb color', function () {
    assert.equal(
      regex_exec('rgb(123, 123, 123)', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
  });
  it('Should match a simple rgba color', function () {
    assert.equal(
      regex_exec('rgba(123, 123, 123, 0)', REGEXP)[1],
      'rgba(123, 123, 123, 0)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 0.3)', REGEXP)[1],
      'rgba(123, 123, 123, 0.3)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, .3)', REGEXP)[1],
      'rgba(123, 123, 123, .3)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 1)', REGEXP)[1],
      'rgba(123, 123, 123, 1)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 1.0)', REGEXP)[1],
      'rgba(123, 123, 123, 1.0)',
    );
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('rgba(123, 123, 123, 1.1)', REGEXP));
    assert.isNull(regex_exec('rgb(,123, 123)', REGEXP));
  });
  it('Should match inside a string', function () {
    assert.equal(
      regex_exec('"rgba(123, 123, 123, 1)"', REGEXP)[1],
      'rgba(123, 123, 123, 1)',
    );
    assert.equal(
      regex_exec('"rgb(123, 123, 123)"', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
  });

  it('Should match with different characters at the end', function () {
    assert.equal(
      regex_exec('rgb(123, 123, 123) ', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123),', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123);', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123)\n', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123))', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123)}', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 123)<', REGEXP)[1],
      'rgb(123, 123, 123)',
    );
  });

  it('Should accept dot values (rgb)', function () {
    assert.equal(
      regex_exec('rgb(12.3, 123, 123)', REGEXP)[1],
      'rgb(12.3, 123, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 12.3, 123)', REGEXP)[1],
      'rgb(123, 12.3, 123)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 12.3)', REGEXP)[1],
      'rgb(123, 123, 12.3)',
    );
    assert.equal(
      regex_exec('rgb(123, 123, 12.333333)', REGEXP)[1],
      'rgb(123, 123, 12.333333)',
    );
    assert.equal(
      regex_exec('rgb(12.3, 12.3, 12.3)', REGEXP)[1],
      'rgb(12.3, 12.3, 12.3)',
    );
    assert.equal(
      regex_exec('rgb(.3, 12.3, 12.3)', REGEXP)[1],
      'rgb(.3, 12.3, 12.3)',
    );
  });

  it('Should accept dot values (rgba)', function () {
    assert.equal(
      regex_exec('rgba(12.3, 123, 123, 0)', REGEXP)[1],
      'rgba(12.3, 123, 123, 0)',
    );
    assert.equal(
      regex_exec('rgba(123, 12.3, 123, 0)', REGEXP)[1],
      'rgba(123, 12.3, 123, 0)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 12.3, 0)', REGEXP)[1],
      'rgba(123, 123, 12.3, 0)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 1.0)', REGEXP)[1],
      'rgba(123, 123, 123, 1.0)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 1.00)', REGEXP)[1],
      'rgba(123, 123, 123, 1.00)',
    );
    assert.equal(
      regex_exec('rgba(123, 123, 123, 1)', REGEXP)[1],
      'rgba(123, 123, 123, 1)',
    );
    assert.equal(
      regex_exec('rgba(.123, 123, 123, 1)', REGEXP)[1],
      'rgba(.123, 123, 123, 1)',
    );
  });
});

describe('Extract color', () => {
  (
    [
      {
        input: 'rgb(255 255 255)',
        expected: {
          rgb: [255, 255, 255],
          alpha: 1,
        },
      },
      {
        input: 'rgb(255 255 255 / 50%)',
        expected: {
          rgb: [255, 255, 255],
          alpha: 0.5,
        },
      },
      {
        input: 'rgb(255 255 255 / 255%)',
        expected: {
          rgb: [255, 255, 255],
          alpha: 1,
        },
      },
      {
        input: 'rgba(0 255 255)',
        expected: {
          rgb: [0, 255, 255],
          alpha: 1,
        },
      },
      {
        input: 'rgba(0 255 255 / 50)',
        expected: {
          rgb: [0, 255, 255],
          alpha: 1,
        },
      },
      {
        input: 'rgba(.1 25.5 2.55 / 50)',
        expected: {
          rgb: [0.1, 25.5, 2.55],
          alpha: 1,
        },
      },
      {
        input: 'rgb(2% 13% 255)',
        expected: {
          rgb: [5.1, 33.15, 255],
          alpha: 1,
        },
      },
      {
        input: 'rgb(123, 123, 123)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgba(123, 123, 123, 0)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 0,
        },
      },
      {
        input: 'rgba(123, 123, 123, 0.3)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 0.3,
        },
      },
      {
        input: 'rgba(123, 123, 123, .3)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 0.3,
        },
      },
      {
        input: 'rgba(123, 123, 123, 1)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgba(123, 123, 123, 1.0)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgb(12.3, 123, 123)',
        expected: {
          rgb: [12.3, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgb(123, 12.3, 123)',
        expected: {
          rgb: [123, 12.3, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgb(123, 123, 12.3)',
        expected: {
          rgb: [123, 123, 12.3],
          alpha: 1,
        },
      },
      {
        input: 'rgb(123, 123, 12.333333)',
        expected: {
          rgb: [123, 123, 12.333333],
          alpha: 1,
        },
      },
      {
        input: 'rgb(12.3, 12.3, 12.3)',
        expected: {
          rgb: [12.3, 12.3, 12.3],
          alpha: 1,
        },
      },
      {
        input: 'rgb(.3, 12.3, 12.3)',
        expected: {
          rgb: [0.3, 12.3, 12.3],
          alpha: 1,
        },
      },
      {
        input: 'rgba(12.3, 123, 123, 0)',
        expected: {
          rgb: [12.3, 123, 123],
          alpha: 0,
        },
      },
      {
        input: 'rgba(123, 12.3, 123, 0)',
        expected: {
          rgb: [123, 12.3, 123],
          alpha: 0,
        },
      },
      {
        input: 'rgba(123, 123, 12.3, 0)',
        expected: {
          rgb: [123, 123, 12.3],
          alpha: 0,
        },
      },
      {
        input: 'rgba(123, 123, 123, 1.0)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgba(123, 123, 123, 1.00)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgba(123, 123, 123, 1)',
        expected: {
          rgb: [123, 123, 123],
          alpha: 1,
        },
      },
      {
        input: 'rgba(.123, 123, 123, 1)',
        expected: {
          rgb: [0.123, 123, 123],
          alpha: 1,
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
      const color = RGBStrategy.extractColor(test.input) as Color;
      assert.deepEqual(color.rgb, test.expected.rgb);
      assert.deepEqual(color.alpha, test.expected.alpha);
    });
  });
});
