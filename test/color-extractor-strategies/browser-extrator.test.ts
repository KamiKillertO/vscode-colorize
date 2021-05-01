import { assert } from 'chai';

import { REGEXP } from '../../src/lib/colors/strategies/browser-strategy';
import { regex_exec } from '../test-util';
import { describe, it } from 'mocha';

// Defines a Mocha test suite to group tests of similar kind together
describe('Test browser predefined color Regex', () => {

  it('white should match', function () {
    assert.equal(regex_exec(' white', REGEXP)[1], 'white');
    assert.equal(regex_exec(',white', REGEXP)[1], 'white');
    assert.equal(regex_exec('(white', REGEXP)[1], 'white');
    assert.equal(regex_exec(':white', REGEXP)[1], 'white');
    assert.equal(regex_exec('"white"', REGEXP)[1], 'white');
    // eslint-disable-next-line
    assert.equal(regex_exec("'white'", REGEXP)[1], 'white');
  });
  it('Should not match without a valid char before', function() {
    assert.isNull(regex_exec('awhite', REGEXP));
    assert.isNull(regex_exec('-white', REGEXP));
    assert.isNull(regex_exec('$white', REGEXP));
  });

  it('Should match with different characters at the end', function () {
    assert.equal(regex_exec(' white', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white ', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white,', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white;', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white\n', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white)', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white}', REGEXP)[1], 'white');
    assert.equal(regex_exec(' white<', REGEXP)[1], 'white');
  });
  it('Should not match', function () {
    assert.isNull(regex_exec('white-', REGEXP));
    assert.isNull(regex_exec('-white', REGEXP));
  });
});
