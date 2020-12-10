import { assert } from 'chai';
import { describe, it } from 'mocha';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/variables/strategies/css-strategy';
import CssExtractor from  '../../src/lib/variables/strategies/css-strategy';
import VariablesManager from  '../../src/lib/variables/variables-manager';
import Variable from '../../src/lib/variables/variable';
import { regex_exec } from '../test-util';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.equal(regex_exec('--var:', DECLARATION_REGEXP)[1], '--var');
    assert.equal(regex_exec('--var-two:', DECLARATION_REGEXP)[1], '--var-two');
    assert.equal(regex_exec('--var--two:', DECLARATION_REGEXP)[1], '--var--two');
    assert.equal(regex_exec('--var-two-three:', DECLARATION_REGEXP)[1], '--var-two-three');
    assert.equal(regex_exec('--var--two--three:', DECLARATION_REGEXP)[1], '--var--two--three');
    assert.equal(regex_exec('--var-:', DECLARATION_REGEXP)[1], '--var-');
    assert.equal(regex_exec('--var--two:', DECLARATION_REGEXP)[1], '--var--two');
    assert.equal(regex_exec('--varTwo:', DECLARATION_REGEXP)[1], '--varTwo');
    assert.equal(regex_exec('--varTwo       :', DECLARATION_REGEXP)[1], '--varTwo       ');
  });
  it('Should not match (css variables)', function () {
    assert.isNull(regex_exec('--var', DECLARATION_REGEXP));
    assert.isNull(regex_exec('--:', DECLARATION_REGEXP));
    assert.isNull(regex_exec('-- :', DECLARATION_REGEXP));
    assert.isNull(regex_exec('-var:', DECLARATION_REGEXP));
    assert.isNull(regex_exec(':', DECLARATION_REGEXP));
    assert.isNull(regex_exec('_a:', DECLARATION_REGEXP));
  });
});

describe('Test variables use regexp', function() {

  // css variables (works for postcss too)
  it('Should match (css variables)', function () {
    assert.equal(regex_exec('var(--var)', REGEXP)[2], '--var');
    assert.equal(regex_exec('var(--var-two)', REGEXP)[2], '--var-two');
    assert.equal(regex_exec('var(--var-)', REGEXP)[2], '--var-');
    assert.equal(regex_exec('var(--var--two)', REGEXP)[2], '--var--two');
    assert.equal(regex_exec('var(--var--two--three)', REGEXP)[2], '--var--two--three');
    assert.equal(regex_exec('var(--var-two-three)', REGEXP)[2], '--var-two-three');
    assert.equal(regex_exec('var(--varTwo)', REGEXP)[2], '--varTwo');
  });
  it('Should not match (css variables)', function () {
    assert.isNull(regex_exec('--var', REGEXP));
    assert.isNull(regex_exec('-- ', REGEXP));
    assert.isNull(regex_exec('--', REGEXP));
    assert.isNull(regex_exec('var(--)', REGEXP));
    assert.isNull(regex_exec('var(-a)', REGEXP));
    assert.isNull(regex_exec('var(a)', REGEXP));
    assert.isNull(regex_exec('var()', REGEXP));
  });
});
describe('Test decoration generation', () => {

  it('The generated decoration should contain (var)', async function() {
    // const extractor = new CssExtractor();
    await CssExtractor.extractDeclarations('fileName', [{line: 0, text: '--darken: blue'}]);
    const variables = await CssExtractor.extractVariables('fileName', [{line: 0, text: 'var(--darken);'}]);
    assert.lengthOf(variables, 1);
    assert.lengthOf(variables[0].colors, 1);
    const decoration = VariablesManager.generateDecoration(<Variable>variables[0].colors[0], 0);
    assert.equal(decoration.currentRange.start.line, 0);
    assert.equal(decoration.currentRange.start.character, 0);
    assert.equal(decoration.currentRange.end.line, 0);
    assert.equal(decoration.currentRange.end.character, 13);
  });

  it('The generated decoration should surround the variable use', async function() {
    // const extractor = new CssExtractor();
    await CssExtractor.extractDeclarations('fileName', [{line: 0, text: '--darken: blue'}]);
    const variables = await CssExtractor.extractVariables('fileName', [{line: 0, text: 'color: var(--darken);'}]);
    assert.lengthOf(variables, 1);
    assert.lengthOf(variables[0].colors, 1);
    const decoration = VariablesManager.generateDecoration(<Variable>variables[0].colors[0], 0);
    assert.equal(decoration.currentRange.start.line, 0);
    assert.equal(decoration.currentRange.start.character, 7);
    assert.equal(decoration.currentRange.end.line, 0);
    assert.equal(decoration.currentRange.end.character, 20);
  });
});
