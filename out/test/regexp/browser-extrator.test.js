"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const browser_extractor_1 = require("../../src/lib/colors/extractors/browser-extractor");
// Defines a Mocha test suite to group tests of similar kind together
describe('Test browser predefined color Regex', () => {
    it('white should match', function () {
        chai_1.assert.ok(' white'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(',white'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok('(white'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(':white'.match(browser_extractor_1.REGEXP));
    });
    it('Should not match inside a string', function () {
        chai_1.assert.notOk('"white""'.match(browser_extractor_1.REGEXP));
    });
    it('Should not match without a valid char before', function () {
        chai_1.assert.notOk('awhite'.match(browser_extractor_1.REGEXP));
        chai_1.assert.notOk('-white'.match(browser_extractor_1.REGEXP));
        chai_1.assert.notOk('$white'.match(browser_extractor_1.REGEXP));
    });
    it('Should match with different characters at the end', function () {
        chai_1.assert.ok(' white'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(' white '.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(' white,'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(' white;'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(' white\n'.match(browser_extractor_1.REGEXP));
        chai_1.assert.ok(' white)\n'.match(browser_extractor_1.REGEXP));
    });
    it('Should not match', function () {
        chai_1.assert.notOk('white-'.match(browser_extractor_1.REGEXP));
        // assert.notOk('-white'.match(REGEXP)); //?
    });
});
//# sourceMappingURL=browser-extrator.test.js.map