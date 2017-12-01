import {
  assert
} from 'chai';

import ColorUtil, { colorLuminance, convertHslaToRgba, convertRgbaToHsla } from '../src/lib/color-util';
import Color from '../src/lib/colors/color';

describe('Test utility fonction', () => {
  it('Should not extract invalid colors from a text', async () => {
    const colors = await ColorUtil.findColors('#ffg, rgb(323,123,123)');
    assert.equal(0, colors.length, 'Should have found 0 colors');
  });
  it('Should extract Colors from a text', async () => {
    const colors = await ColorUtil.findColors('#fff, rgb(123,123,123), #dccdcd, linear-gradient(to bottom right, #fff, #ccc), white, hsl(123,10%,1%)');
    assert.equal(7, colors.length, 'Should have found 7 colors');
  });
  it('Should return the color luminance', () => {
    assert.equal(colorLuminance(new Color('#fff', 0, 1, [255, 255, 255])), 1, 'Should be "1" for #fff');
    assert.equal(colorLuminance(new Color('#ffffff', 0, 1, [255, 255, 255])), 1, 'Should be "1" for #ffffff');
    assert.equal(colorLuminance(new Color('#000', 0, 1, [0, 0, 0])), 0, 'Should be "0" for #000');
    assert.equal(colorLuminance(new Color('#000000', 0, 1, [0, 0, 0])), 0, 'Should be "0" for #000000');
    assert.equal(colorLuminance(new Color('#ccc', 0, 1, [204, 204, 204])).toFixed(1), 0.6, 'Should be around "0.6" for #ccc');
  });
  it('Should convert hsla colors in rgba colors', function() {
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
  it('Should convert rgba colors in hsla colors', function() {
    assert.deepEqual(convertRgbaToHsla(128, 128, 128), [0, 0, 50, 1]);
    assert.deepEqual(convertRgbaToHsla(0, 0, 0), [0, 0, 0, 1]);
    assert.deepEqual(convertRgbaToHsla(3, 3, 3), [0, 0, 1, 1]);
    assert.deepEqual(convertRgbaToHsla(255, 255, 255), [0, 0, 100, 1]);
    assert.deepEqual(convertRgbaToHsla(255, 0, 0), [0, 100, 50, 1]);

    assert.deepEqual(convertRgbaToHsla(0, 255, 255), [180, 100, 50, 1]);
    assert.deepEqual(convertRgbaToHsla(133, 42, 213), [272, 67, 50, 1]);
  });
});
