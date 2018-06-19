import { assert } from 'chai';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/variables/strategies/css-strategy';
import CssExtractor from  '../../src/lib/variables/strategies/css-strategy';
import VariablesManager from  '../../src/lib/variables/variables-manager';
import Variable from '../../src/lib/variables/variable';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('--var:'.match(DECLARATION_REGEXP));
    assert.ok('--var-two:'.match(DECLARATION_REGEXP));
    assert.ok('--var-:'.match(DECLARATION_REGEXP));
    assert.ok('--var--two:'.match(DECLARATION_REGEXP));
    assert.ok('--varTwo:'.match(DECLARATION_REGEXP));
    assert.ok('--varTwo       :'.match(DECLARATION_REGEXP)); // fail
  });
  it('Should not match (css variables)', function () {
    assert.notMatch('--var', DECLARATION_REGEXP);
    assert.notMatch('-- :', DECLARATION_REGEXP);
    assert.notMatch('-var:', DECLARATION_REGEXP);
    assert.notMatch(':', DECLARATION_REGEXP);
  });
});

describe('Test variables use regexp', function() {

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.ok('var(--var)'.match(REGEXP));
    assert.ok('var(--var-two)'.match(REGEXP));
    assert.ok('var(--var-)'.match(REGEXP));
    assert.ok('var(--var--two)'.match(REGEXP));
    assert.ok('var(--varTwo)'.match(REGEXP));
  });
  it('Should not match (css variables)', function () {
    assert.notOk('--var'.match(REGEXP));
    assert.notOk('-- '.match(REGEXP));
    assert.notOk('--'.match(REGEXP));
    assert.notOk('var(--)'.match(REGEXP));
    assert.notOk('var(-var)'.match(REGEXP));
    assert.notOk('var(var)'.match(REGEXP));
    assert.notOk('var()'.match(REGEXP));
  });
});
describe('Test decoration generation', () => {

  it('The generated decoration should contain (var)', async function() {
    const extractor = new CssExtractor();
    await extractor.extractDeclarations('fileName', [{line: 0, text: '--darken: blue'}]);
    const variables = await extractor.extractVariables('fileName', [{line: 0, text: 'var(--darken);'}]);
    assert.lengthOf(variables, 1);
    assert.lengthOf(variables[0].colors, 1);
    const decoration = VariablesManager.generateDecoration(<Variable>variables[0].colors[0], 0);
    assert.equal(decoration.currentRange.start.line, 0);
    assert.equal(decoration.currentRange.start.character, 0);
    assert.equal(decoration.currentRange.end.line, 0);
    assert.equal(decoration.currentRange.end.character, 13);
  });

  it('The generated decoration should surround the variable use', async function() {
    const extractor = new CssExtractor();
    await extractor.extractDeclarations('fileName', [{line: 0, text: '--darken: blue'}]);
    const variables = await extractor.extractVariables('fileName', [{line: 0, text: 'color: var(--darken);'}]);
    assert.lengthOf(variables, 1);
    assert.lengthOf(variables[0].colors, 1);
    const decoration = VariablesManager.generateDecoration(<Variable>variables[0].colors[0], 0);
    assert.equal(decoration.currentRange.start.line, 0);
    assert.equal(decoration.currentRange.start.character, 7);
    assert.equal(decoration.currentRange.end.line, 0);
    assert.equal(decoration.currentRange.end.character, 20);
  });
});
