import { assert } from 'chai';
import { describe, it } from 'mocha';

import {
  REGEXP,
  DECLARATION_REGEXP,
} from '../../../src/lib/variables/strategies/less-strategy';
import { regex_exec } from '../../test-util';
// Defines a Mocha test suite to group tests of similar kind together
describe('Test variables declaration Regex', () => {
  // less
  it('Should match (less variables)', function () {
    assert.equal(regex_exec('@var:', DECLARATION_REGEXP)[1], '@var');
    assert.equal(regex_exec('@var-two:', DECLARATION_REGEXP)[1], '@var-two');
    assert.equal(
      regex_exec('@var-two-three:', DECLARATION_REGEXP)[1],
      '@var-two-three',
    );
    assert.equal(
      regex_exec('@var-two   :', DECLARATION_REGEXP)[1],
      '@var-two   ',
    );

    assert.equal(
      regex_exec('@normal-var:', DECLARATION_REGEXP)[1],
      '@normal-var',
    );
    assert.equal(
      regex_exec('@with-number1:', DECLARATION_REGEXP)[1],
      '@with-number1',
    );
    assert.equal(
      regex_exec('@with-letterA:', DECLARATION_REGEXP)[1],
      '@with-letterA',
    );
    assert.equal(
      regex_exec('@with-dash-1:', DECLARATION_REGEXP)[1],
      '@with-dash-1',
    );
    assert.equal(
      regex_exec('@with-dash-A:', DECLARATION_REGEXP)[1],
      '@with-dash-A',
    );
    assert.equal(
      regex_exec('@with-underscore_B:', DECLARATION_REGEXP)[1],
      '@with-underscore_B',
    );
    assert.equal(
      regex_exec('@with-underscore_2:', DECLARATION_REGEXP)[1],
      '@with-underscore_2',
    );
    assert.equal(regex_exec('@colorA:', DECLARATION_REGEXP)[1], '@colorA');
    assert.equal(regex_exec('@a1:', DECLARATION_REGEXP)[1], '@a1');
  });
  it('Should not match (less variables)', function () {
    assert.isNull(regex_exec('@var', DECLARATION_REGEXP));
    assert.isNull(regex_exec('@ :', DECLARATION_REGEXP));
    assert.isNull(regex_exec('@:', DECLARATION_REGEXP));
    assert.isNull(regex_exec('@1a:', DECLARATION_REGEXP));
  });
});

describe('Test variables use regexp', function () {
  // less
  it('Should match (less variables)', function () {
    assert.equal(regex_exec('@var', REGEXP)[1], '@var');
    assert.equal(regex_exec('@var-two', REGEXP)[1], '@var-two');

    assert.equal(regex_exec('@normal-var', REGEXP)[1], '@normal-var');
    assert.equal(regex_exec('@with-number1', REGEXP)[1], '@with-number1');
    assert.equal(regex_exec('@with-letterA', REGEXP)[1], '@with-letterA');
    assert.equal(regex_exec('@with-dash-1', REGEXP)[1], '@with-dash-1');
    assert.equal(regex_exec('@with-dash-A', REGEXP)[1], '@with-dash-A');
    assert.equal(
      regex_exec('@with-underscore_2', REGEXP)[1],
      '@with-underscore_2',
    );
    assert.equal(
      regex_exec('@with-underscore_B', REGEXP)[1],
      '@with-underscore_B',
    );
    assert.equal(regex_exec('@a1', REGEXP)[1], '@a1');
  });
  it('Should not match (less variables)', function () {
    assert.isNull(regex_exec('@', REGEXP));
    assert.isNull(regex_exec('@ ', REGEXP));
    assert.isNull(regex_exec('@1a', REGEXP));
  });
});
