import { assert } from 'chai';

import ColorUtil, {
  convertHslaToRgba,
  convertRgbaToHsla,
} from '../../lib/util/color-util';
import type { IColor } from '../../lib/colors/color';
import { beforeEach, describe, it } from 'mocha';

describe('Test utility fonction', () => {
  beforeEach(() => {
    ColorUtil.setupColorsExtractors([
      'BROWSERS_COLORS',
      'HEXA',
      'RGB',
      'HSL',
      'OKLAB',
      'OKLCH',
    ]);
  });
  it('Should not extract invalid colors from a text', async () => {
    const colors = await ColorUtil.findColors([
      { line: 1, text: '#ffg, rgb(323,123,123)' },
    ]);
    assert.equal(
      0,
      colors.reduce((acc, cv) => acc.concat(cv.colors), [] as IColor[]).length,
      'Should have found 0 colors',
    );
  });
  it('Should extract Colors from a text', async () => {
    const colors = await ColorUtil.findColors([
      {
        line: 1,
        text: '#fff, rgb(123,123,123), #dccdcd, linear-gradient(to bottom right, #fff, #ccc), white, hsl(123,10%,1%)',
      },
    ]);
    assert.equal(
      7,
      colors.reduce((acc, cv) => acc.concat(cv.colors), [] as IColor[]).length,
      'Should have found 7 colors',
    );
  });

  it('Should convert hsla colors in rgba colors', function () {
    assert.deepEqual(convertHslaToRgba(0, 0, 50), [128, 128, 128, 1]);
    assert.deepEqual(convertHslaToRgba(0, 0, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertHslaToRgba(0, 0, 1), [3, 3, 3, 1]);
    assert.deepEqual(convertHslaToRgba(0, 0, 100), [255, 255, 255, 1]);
    assert.deepEqual(convertHslaToRgba(0, 100, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertHslaToRgba(359, 0, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertHslaToRgba(359, 100, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertHslaToRgba(0, 100, 50), [255, 0, 0, 1]);
    assert.deepEqual(convertHslaToRgba(180, 100, 50), [0, 255, 255, 1]);
  });
  it('Should convert rgba colors in hsla colors', function () {
    assert.deepEqual(convertRgbaToHsla(128, 128, 128), [0, 0, 50, 1]);
    assert.deepEqual(convertRgbaToHsla(0, 0, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertRgbaToHsla(3, 3, 3), [0, 0, 1, 1]);
    assert.deepEqual(convertRgbaToHsla(255, 255, 255), [0, 0, 100, 1]);
    assert.deepEqual(convertRgbaToHsla(255, 0, 0), [0, 100, 50, 1]);

    assert.deepEqual(convertRgbaToHsla(0, 255, 255), [180, 100, 50, 1]);
    assert.deepEqual(convertRgbaToHsla(133, 42, 213), [272, 67, 50, 1]);
  });
});
