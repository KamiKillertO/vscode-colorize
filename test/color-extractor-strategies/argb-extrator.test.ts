import { assert } from 'chai';
import ARGBStrategy from '../../src/lib/colors/strategies/argb-strategy';

// Defines a Mocha test suite to group tests of similar kind together
describe('ARGB color extractor', () => {

  describe('[SHORT] Test extractor output', function() {
    it('Should correctly extract #fff', function () {
      let color = ARGBStrategy.extractColor('#fff');
      assert.equal(color.value, '#fff');
      assert.deepEqual(color.rgb, [255, 255, 255]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract #000', function () {
      let color = ARGBStrategy.extractColor('#000');
      assert.equal(color.value, '#000');
      assert.deepEqual(color.rgb, [0, 0, 0]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract the alpha value', function () {
      let color = ARGBStrategy.extractColor('#0000');
      assert.equal(color.value, '#0000');
      assert.equal(color.alpha, 0);
    });
    it('Should correctly extract the red value', function() {
      const color = ARGBStrategy.extractColor('#F00');
      assert.deepEqual(color.rgb, [255, 0, 0]);
    });
    it('Should correctly extract the green value', function() {
      const color = ARGBStrategy.extractColor('#0A0');
      assert.deepEqual(color.rgb, [0, 170, 0]);
    });
    it('Should correctly extract the blue value', function() {
      const color = ARGBStrategy.extractColor('#002');
      assert.deepEqual(color.rgb, [0, 0, 34]);
    });
  });
  describe('Test extractor output', function() {
    it('Should correctly extract #ffffff', function () {
      let color = ARGBStrategy.extractColor('#ffffff');
      assert.equal(color.value, '#ffffff');
      assert.deepEqual(color.rgb, [255, 255, 255]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract #000000', function () {
      let color = ARGBStrategy.extractColor('#000000');
      assert.equal(color.value, '#000000');
      assert.deepEqual(color.rgb, [0, 0, 0]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract #0011AA33', function () {
      let color = ARGBStrategy.extractColor('#0011AA33');
      assert.equal(color.value, '#0011AA33');
      assert.deepEqual(color.rgb, [17, 170, 51]);
      assert.equal(color.alpha, 0);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract the alpha value', function () {
      let color = ARGBStrategy.extractColor('#13000000');
      assert.equal(color.value, '#13000000');
      assert.equal(color.alpha.toFixed(3), '0.075');
    });
    it('Should correctly extract the red value', function() {
      const color = ARGBStrategy.extractColor('#F10000');
      assert.deepEqual(color.rgb, [241, 0, 0]);
    });
    it('Should correctly extract the green value', function() {
      const color = ARGBStrategy.extractColor('#001F00');
      assert.deepEqual(color.rgb, [0, 31, 0]);
    });
    it('Should correctly extract the blue value', function() {
      const color = ARGBStrategy.extractColor('#0000D7');
      assert.deepEqual(color.rgb, [0, 0, 215]);
    });
  });

  describe('[0x prefix][SHORT] Test extractor output', function() {
    it('Should correctly extract 0xfff', function () {
      let color = ARGBStrategy.extractColor('0xfff');
      assert.equal(color.value, '0xfff');
      assert.deepEqual(color.rgb, [255, 255, 255]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract 0x000', function () {
      let color = ARGBStrategy.extractColor('0x000');
      assert.equal(color.value, '0x000');
      assert.deepEqual(color.rgb, [0, 0, 0]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract the alpha value', function () {
      let color = ARGBStrategy.extractColor('0x0000');
      assert.equal(color.value, '0x0000');
      assert.equal(color.alpha, 0);
    });
    it('Should correctly extract the red value', function() {
      const color = ARGBStrategy.extractColor('0xF00');
      assert.deepEqual(color.rgb, [255, 0, 0]);
    });
    it('Should correctly extract the green value', function() {
      const color = ARGBStrategy.extractColor('0x0A0');
      assert.deepEqual(color.rgb, [0, 170, 0]);
    });
    it('Should correctly extract the blue value', function() {
      const color = ARGBStrategy.extractColor('0x002');
      assert.deepEqual(color.rgb, [0, 0, 34]);
    });
  });
  describe('[0x prefix]Test extractor output', function() {
    it('Should correctly extract 0xffffff', function () {
      let color = ARGBStrategy.extractColor('0xffffff');
      assert.equal(color.value, '0xffffff');
      assert.deepEqual(color.rgb, [255, 255, 255]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract 0x000000', function () {
      let color = ARGBStrategy.extractColor('0x000000');
      assert.equal(color.value, '0x000000');
      assert.deepEqual(color.rgb, [0, 0, 0]);
      assert.equal(color.alpha, 1);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract 0x0011AA33', function () {
      let color = ARGBStrategy.extractColor('0x0011AA33');
      assert.equal(color.value, '0x0011AA33');
      assert.deepEqual(color.rgb, [17, 170, 51]);
      assert.equal(color.alpha, 0);
      assert.equal(color.positionInText, 0);
    });
    it('Should correctly extract the alpha value', function () {
      let color = ARGBStrategy.extractColor('0x13000000');
      assert.equal(color.value, '0x13000000');
      assert.equal(color.alpha.toFixed(3), '0.075');
    });
    it('Should correctly extract the red value', function() {
      const color = ARGBStrategy.extractColor('0xF10000');
      assert.deepEqual(color.rgb, [241, 0, 0]);
    });
    it('Should correctly extract the green value', function() {
      const color = ARGBStrategy.extractColor('0x001F00');
      assert.deepEqual(color.rgb, [0, 31, 0]);
    });
    it('Should correctly extract the blue value', function() {
      const color = ARGBStrategy.extractColor('0x0000D7');
      assert.deepEqual(color.rgb, [0, 0, 215]);
    });
  });
});
