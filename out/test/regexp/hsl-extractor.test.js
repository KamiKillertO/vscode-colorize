"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hsl_extractor_1 = require("../../src/lib/colors/extractors/hsl-extractor");
describe('Test hsl(a) color Regex', () => {
    it('Should match a simple hsl color', function () {
        chai_1.assert.ok('hsl(200,10%,10%)'.match(hsl_extractor_1.REGEXP));
    });
    it('Should match a simple hsla color', function () {
        chai_1.assert.ok('hsla(200,10%,10%, 0)'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsla(200,10%,10%, 0.3)'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsla(200,10%,10%, .3)'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsla(200,10%,10%, 1)'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsla(200,10%,10%, 1.0)'.match(hsl_extractor_1.REGEXP));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('hsla(123,100%,1%,1.1)'.match(hsl_extractor_1.REGEXP));
    });
    it('Should match inside a string', function () {
        chai_1.assert.ok('"hsl(123,10%,10%)"'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('"hsla(123,10%,10%,0)"'.match(hsl_extractor_1.REGEXP));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok('hsl(200,10%,10%) '.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsl(200,10%,10%),'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsl(200,10%,10%);'.match(hsl_extractor_1.REGEXP));
        chai_1.assert.ok('hsl(200,10%,10%)\n'.match(hsl_extractor_1.REGEXP));
    });
});
//# sourceMappingURL=hsl-extractor.test.js.map