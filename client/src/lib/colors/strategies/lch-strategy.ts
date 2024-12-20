import Color from '../color';
import ColorExtractor from '../color-extractor';
import { DOT_VALUE, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';
import { default as ColorJS } from 'colorjs.io';

const R_L = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_C = R_L;
const R_H = R_L;
const R_ALPHA = `(\\s*\\/\\s*${R_L}%?\\s*)?`;

const LCH_SYNTAX = `lch?\\(\\s*${R_L}%?\\s*\\s*-?${R_C}%?\\s*\\s*-?${R_H}(deg)?\\s*${R_ALPHA}\\)`;

export const REGEXP = new RegExp(`(${LCH_SYNTAX})${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(${LCH_SYNTAX})${EOL}`, 'i');

function getColor(match: RegExpExecArray) {
  const color = new ColorJS(match[1]);

  const [r, g, b] = color.srgb.map((v) => v * 255);
  return new Color(match[1], match.index, [r, g, b], color.alpha);
}

const strategy = new ColorStrategy('LCH', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
