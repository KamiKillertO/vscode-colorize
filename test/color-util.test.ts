import {
  assert
} from 'chai';

import ColorUtil from '../src/color-util';
import Color from '../src/color';

describe('Test utility fonction', () => {
  it('Should not extract invalid colors from a text', (done) => {
    ColorUtil.findColors('#ffg, rgb(323,123,123)').then(colors => {
      assert.equal(0, colors.length, 'Should have found 0 colors');
      done();
    });
  });
  it('Should extract Colors from a text', (done) => {
    ColorUtil.findColors('#fff, rgb(123,123,123), #dccdcd, linear-gradient(to bottom right, #fff, #ccc)').then(colors => {
      assert.equal(5, colors.length, 'Should have found 5 colors');
      done();
    });
  });
  it('Should return the color luminance', () => {
    assert.equal(ColorUtil.luminance(new Color('hexa', '#fff')), 1, 'Should be "1" for #fff');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#ffffff')), 1, 'Should be "1" for #ffffff');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#000')), 0, 'Should be "0" for #000');
    assert.equal(ColorUtil.luminance(new Color('hexa', '#000000')), 0, 'Should be "0" for #000000');

    assert.equal(ColorUtil.luminance(new Color('hexa', '#ccc')).toFixed(1), 0.6, 'Should be around "0.6" for #ccc');

  });
});
