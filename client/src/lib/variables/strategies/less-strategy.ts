import VariablesExtractor from '../variables-extractor';
import { EOL } from '../../util/regexp';
import VariableStrategy from './__strategy-base';

export const REGEXP = new RegExp(`(@(?:[a-z]+[\\-_a-z\\d]*)(?!:))${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(
  `^(@(?:[a-z]+[\\-_a-z\\d]*)(?!:))${EOL}`,
  'i',
);
export const DECLARATION_REGEXP = new RegExp(
  `(?:(@(?:[a-z]+[\\-_a-z\\d]*)\\s*):)${EOL}`,
  'gi',
);

const RegexpExtractor = {
  getVariableNameFromDeclaration(match: RegExpExecArray) {
    return (match[1] || match[2]).trim();
  },

  getVariableNameFromUses(match: RegExpExecArray) {
    return [match[1].trim()];
  },

  getVariableNameFromUse(match: RegExpMatchArray) {
    return match[1].trim();
  },
};

VariablesExtractor.registerStrategy(
  new VariableStrategy(
    'LESS',
    DECLARATION_REGEXP,
    REGEXP,
    REGEXP_ONE,
    RegexpExtractor,
  ),
);
