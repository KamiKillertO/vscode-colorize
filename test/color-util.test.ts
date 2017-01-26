import {
  assert
} from 'chai';

import ColorUtil from '../src/color-util';
import Color from '../src/color';

describe('Test utility fonction', () => {
  it('Should return the rgb value of a color', () => {
    assert.deepEqual(ColorUtil.getRGB(new Color('hexa', '#fff')), [255, 255, 255], 'Should return rgb values for CSS hexa shorthand color');
    assert.deepEqual(ColorUtil.getRGB(new Color('hexa', '#ffffff')), [255, 255, 255], 'Should return rgb values for CSS hexa color');
  });
  it('Should return the color luminance', () => {
    assert.equal(ColorUtil.luminance(new Color('hexa', '#fff')), 1, 'Should be "1" for #fff');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#ffffff')), 1, 'Should be "1" for #ffffff');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#000')), 0, 'Should be "0" for #000');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#000000')), 0, 'Should be "0" for #000000');

    assert.equal(ColorUtil.luminance(new Color('hexa', '#ccc')).toFixed(1), 0.6, 'Should be around "0.6" for #ccc');

  });
});
