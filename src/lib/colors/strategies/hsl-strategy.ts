import Color from './../color';
import ColorExtractor from '../color-extractor';
import { convertHslaToRgba } from '../../util/color-util';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_HUE = `\\d*${DOT_VALUE}?`;
const R_SATURATION = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_LUMINANCE = R_SATURATION;
const R_ALPHA = `([ ,]\\s*${ALPHA}\\s*|\\s*\\/\\s*${R_SATURATION}%?\\s*)?`;

const HSL_NEW_SYNTAX = `hsla?\\(\\s*${R_HUE}(deg)?\\s*\\s*${R_SATURATION}%?\\s*\\s*${R_LUMINANCE}%?\\s*${R_ALPHA}\\)`;
const HSL_LEGACY_SYNTAX = `hsl\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}%\\s*,\\s*${R_LUMINANCE}%\\s*\\)`;
const HSLA_LEGACY_SYNTAX = `hsla\\(\\s*${R_HUE}\\s*,\\s*${R_SATURATION}%\\s*,\\s*${R_LUMINANCE}%\\s*,\\s*${ALPHA}\\s*\\)`;

export const REGEXP = new RegExp(
  `(${HSL_LEGACY_SYNTAX}|${HSLA_LEGACY_SYNTAX}|${HSL_NEW_SYNTAX})${EOL}`,
  'gi',
);
export const REGEXP_ONE = new RegExp(
  `^(${HSL_LEGACY_SYNTAX}|${HSLA_LEGACY_SYNTAX}|${HSL_NEW_SYNTAX})${EOL}`,
  'i',
);
// export const REGEXP_ONE = /^((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;

/**
 * @private
 * @param {any} value An hsl(a) color string (`hsl(10, 1%, 1%)`)
 * @returns {number[]} The colors h,s,l,a values
 *
 * @memberof HSLColorExtractor
 */
function extractHSLValue(value: string) {
  const [h, s, l, a]: number[] = value
    .replace(/hsl(a){0,1}\(/, '')
    .replace(/\)/, '')
    .replace(/%/g, '')
    .replace(/deg/, '')
    .replaceAll(',', ' ')
    .split(/\s+/)
    .map((c) => parseFloat(c));
  return [h, s, l, a];
}

function getColor(match: RegExpExecArray) {
  const value = match[0];
  const [h, s, l, a] = extractHSLValue(value);
  if (s <= 100 && l <= 100) {
    const [r, g, b] = convertHslaToRgba(h, s, l, a);
    return new Color(match[1], match.index, [r, g, b], a);
  }

  return null;
}

const strategy = new ColorStrategy('HSL', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
