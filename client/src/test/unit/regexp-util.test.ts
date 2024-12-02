import { assert } from 'chai';
import { ALPHA, DOT_VALUE } from '../../lib/util/regexp';
import { describe, it } from 'mocha';
import { regex_exec } from '../helper';

describe('Util regexp (util/regexp.ts)', () => {
  it('Should extract a dot value', () => {
    assert.equal(regex_exec('.0', DOT_VALUE)[0], '.0', 'Should extract ".0"');
    assert.equal(
      regex_exec('.0123456789', DOT_VALUE)[0],
      '.0123456789',
      'Should extract ".0123456789"',
    );
  });

  it('Can extract valid alpha value', () => {
    assert.equal(regex_exec('1', ALPHA)[0], '1', 'Should extract 1');
    assert.equal(regex_exec('0', ALPHA)[0], '0', 'Should extract 0');
    assert.equal(regex_exec('0.1', ALPHA)[0], '0.1', 'Should extract 0.1');
    assert.equal(
      regex_exec('0.0123456789', ALPHA)[0],
      '0.0123456789',
      'Should extract 0.0123456789',
    );
    assert.equal(regex_exec('1.0', ALPHA)[0], '1.0', 'Should extract 1.0');
    assert.equal(regex_exec('.0', ALPHA)[0], '.0', 'Should extract .0');
    assert.equal(regex_exec('.00', ALPHA)[0], '.00', 'Should extract .00');
    assert.equal(
      regex_exec('.0123456789', ALPHA)[0],
      '.0123456789',
      'Should extract .0123456789',
    );
  });

  it('Should not extract invalid alpha values', () => {
    const R = `^${ALPHA}$`;
    assert.isNull(regex_exec('1.', R));
    assert.isNull(regex_exec('1.1', R));
    assert.isNull(regex_exec('0.', R));
    assert.isNull(regex_exec('.', R));
  });
});
