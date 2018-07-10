import { assert } from 'chai';

import { REGEXP, DECLARATION_REGEXP } from '../../src/lib/variables/strategies/sass-strategy';
import { regex_exec } from '../test-util';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // Sass
  it('Should match (sass variables)', function () {
    assert.equal(regex_exec('$_:', DECLARATION_REGEXP)[1], '$_');
    assert.equal(regex_exec('$var:', DECLARATION_REGEXP)[1], '$var');
    assert.equal(regex_exec('$var-two:', DECLARATION_REGEXP)[1], '$var-two');
    assert.equal(regex_exec('$var--two:', DECLARATION_REGEXP)[1], '$var--two');
    assert.equal(regex_exec('$var-two-three:', DECLARATION_REGEXP)[1], '$var-two-three');
    assert.equal(regex_exec('$var--two--three:', DECLARATION_REGEXP)[1], '$var--two--three');
    assert.equal(regex_exec('$var-two       :', DECLARATION_REGEXP)[1], '$var-two       ');

    assert.equal(regex_exec('$normal-var:', DECLARATION_REGEXP)[1], '$normal-var');
    assert.equal(regex_exec('$with-number1:', DECLARATION_REGEXP)[1], '$with-number1');
    assert.equal(regex_exec('$with-letterA:', DECLARATION_REGEXP)[1], '$with-letterA');
    assert.equal(regex_exec('$with-dash-1:', DECLARATION_REGEXP)[1], '$with-dash-1');
    assert.equal(regex_exec('$with-dash-A:', DECLARATION_REGEXP)[1], '$with-dash-A');
    assert.equal(regex_exec('$with-underscore_B:', DECLARATION_REGEXP)[1], '$with-underscore_B');
    assert.equal(regex_exec('$with-underscore_2:', DECLARATION_REGEXP)[1], '$with-underscore_2');
    assert.equal(regex_exec('$colorA:', DECLARATION_REGEXP)[1], '$colorA');
    assert.equal(regex_exec('$a1:', DECLARATION_REGEXP)[1], '$a1');

  });
  it('Should not match (sass variables)', function () {
    assert.isNull(regex_exec('$var', DECLARATION_REGEXP));
    assert.isNull(regex_exec('$ :', DECLARATION_REGEXP));
    assert.isNull(regex_exec('$1 :', DECLARATION_REGEXP));
    assert.isNull(regex_exec('$1a :', DECLARATION_REGEXP));
    assert.isNull(regex_exec('$- :', DECLARATION_REGEXP));
  });
});

describe('Test variables use regexp', function() {

  // Sass
  it('Should match (sass variables)', function () {
    assert.equal(regex_exec('$_', REGEXP)[1], '$_', '"$_" should match');
    assert.equal(regex_exec('$var', REGEXP)[1], '$var', '"$var" should match');
    assert.equal(regex_exec('$var-two', REGEXP)[1], '$var-two', '"$var-two" should match');
    assert.equal(regex_exec('$var--two', REGEXP)[1], '$var--two', '"$var--two" should match');
    assert.equal(regex_exec('$var-two-tree', REGEXP)[1], '$var-two-tree', '"$var-two-tree" should match');
    assert.equal(regex_exec('$var--two--tree', REGEXP)[1], '$var--two--tree', '"$var--two-tree" should match');

    assert.equal(regex_exec('$normal-var', REGEXP)[1], '$normal-var', '"$normal-var" should match');
    assert.equal(regex_exec('$with-number1', REGEXP)[1], '$with-number1', '"$with-number1" should match');
    assert.equal(regex_exec('$with-letterA', REGEXP)[1], '$with-letterA', '"$with-letterA" should match');
    assert.equal(regex_exec('$with-dash-1', REGEXP)[1], '$with-dash-1',  '"$with-dash-1" should match');
    assert.equal(regex_exec('$with-dash-A', REGEXP)[1], '$with-dash-A', '"$with-dash-A" should match');
    assert.equal(regex_exec('$with-underscore_2', REGEXP)[1], '$with-underscore_2', '"$with-underscore_2" should match');
    assert.equal(regex_exec('$with-underscore_B', REGEXP)[1], '$with-underscore_B', '"$with-underscore_B" should match');
    assert.equal(regex_exec('$a1', REGEXP)[1], '$a1');
  });
  it('Should not match (sass variables)', function () {
    assert.isNull(regex_exec('$ ', REGEXP));
    assert.isNull(regex_exec('$', REGEXP));
    assert.isNull(regex_exec('$-', REGEXP));
    assert.isNull(regex_exec('$1a', REGEXP));
  });
});
