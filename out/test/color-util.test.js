"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const color_util_1 = require("../src/lib/color-util");
const color_1 = require("../src/lib/color");
describe('Test utility fonction', () => {
    it('Should not extract invalid colors from a text', (done) => {
        color_util_1.default.findColors('#ffg, rgb(323,123,123)').then(colors => {
            chai_1.assert.equal(0, colors.length, 'Should have found 0 colors');
            done();
        });
    });
    it('Should extract Colors from a text', (done) => {
        color_util_1.default.findColors('#fff, rgb(123,123,123), #dccdcd, linear-gradient(to bottom right, #fff, #ccc), white, hsl(123,10%,1%)').then(colors => {
            chai_1.assert.equal(7, colors.length, 'Should have found 7 colors');
            done();
        });
    });
    it('Should return the color luminance', () => {
        chai_1.assert.equal(color_util_1.default.luminance(new color_1.default('#fff', 0, 1, [255, 255, 255])), 1, 'Should be "1" for #fff');
        chai_1.assert.equal(color_util_1.default.luminance(new color_1.default('#ffffff', 0, 1, [255, 255, 255])), 1, 'Should be "1" for #ffffff');
        chai_1.assert.equal(color_util_1.default.luminance(new color_1.default('#000', 0, 1, [0, 0, 0])), 0, 'Should be "0" for #000');
        chai_1.assert.equal(color_util_1.default.luminance(new color_1.default('#000000', 0, 1, [0, 0, 0])), 0, 'Should be "0" for #000000');
        chai_1.assert.equal(color_util_1.default.luminance(new color_1.default('#ccc', 0, 1, [204, 204, 204])).toFixed(1), 0.6, 'Should be around "0.6" for #ccc');
    });
});
//# sourceMappingURL=color-util.test.js.map