import Color from '../color';
import ColorExtractor from '../color-extractor';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';
import { default as ColorJS } from 'colorjs.io';

const R_HUE = `\\d*${DOT_VALUE}?`;
const R_WHITENESS = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_BLACKNESS = R_WHITENESS;
const R_ALPHA = `([ ,]\\s*${ALPHA}\\s*|\\s*\\/\\s*${R_WHITENESS}%?\\s*)?`;

const HWB_SYNTAX = `hwb?\\(\\s*${R_HUE}(deg|turn)?\\s*\\s*${R_WHITENESS}%\\s*\\s*${R_BLACKNESS}%\\s*${R_ALPHA}\\)`;

export const REGEXP = new RegExp(`(${HWB_SYNTAX})${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(${HWB_SYNTAX})${EOL}`, 'i');

function getColor(match: RegExpExecArray) {
  const color = new ColorJS(match[1]);

  const [r, g, b] = color.srgb.map((v) => v * 255);
  return new Color(match[1], match.index, [r, g, b], color.alpha);
}

const strategy = new ColorStrategy('HWB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
