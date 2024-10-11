import VariablesExtractor from '../variables-extractor';
import { EOL } from '../../util/regexp';
import VariableStrategy from './__strategy-base';

export const REGEXP = new RegExp(
  `(^|(?::|=)\\s*)((?:[\\-]*[$a-z_][\\-_\\d]*)+)(?!=)${EOL}`,
  'gi'
);
export const REGEXP_ONE = new RegExp(
  `(^|(?::|=)\\s*)((?:[\\-]*[$a-z_][\\-_\\d]*)+)(?!=)${EOL}`,
  'i'
);
export const DECLARATION_REGEXP = new RegExp(
  `(?:(^(?:\\$|(?:[\\-_$]+[a-z\\d]+)|(?:[^\\d||\\-|@]+))(?:[_a-z\\d][\\-]*)*))\\s*=${EOL}`,
  'gi'
);

const RegexpExtractor = {
  getVariableNameFromDeclaration(match: RegExpExecArray) {
    return (match[1] || match[2]).trim();
  },

  getVariableNameFromUses(match: RegExpExecArray): [string, null, string] {
    return [match[2].trim(), null, match[1]];
  },

  getVariableNameFromUse(match: RegExpMatchArray) {
    return match[2].trim();
  },
};

VariablesExtractor.registerStrategy(
  new VariableStrategy(
    'STYLUS',
    DECLARATION_REGEXP,
    REGEXP,
    REGEXP_ONE,
    RegexpExtractor
  )
);
