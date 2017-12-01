"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rgb_extractor_1 = require("../../src/lib/colors/extractors/rgb-extractor");
describe('Test rgb(a) color Regex', () => {
    it('Should match a simple rgb color', function () {
        chai_1.assert.ok('rgb(123,123,123)'.match(rgb_extractor_1.REGEXP));
    });
    it('Should match a simple rgba color', function () {
        chai_1.assert.ok('rgba(123,123,123, 0)'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgba(123,123,123, 0.3)'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgba(123,123,123, .3)'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgba(123,123,123, 1)'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgba(123,123,123, 1.0)'.match(rgb_extractor_1.REGEXP));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('rgba(123,123,123, 1.1)'.match(rgb_extractor_1.REGEXP));
    });
    it('Should match inside a string', function () {
        chai_1.assert.ok('"rgba(123,123,123, 1)"'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('"rgb(123,123,123)"'.match(rgb_extractor_1.REGEXP));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('rgb(123,123,123) '.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgb(123,123,123),'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgb(123,123,123);'.match(rgb_extractor_1.REGEXP));
        chai_1.assert.ok('rgb(123,123,123)\n'.match(rgb_extractor_1.REGEXP));
    });
});
//# sourceMappingURL=rgb-extrator.test.js.map