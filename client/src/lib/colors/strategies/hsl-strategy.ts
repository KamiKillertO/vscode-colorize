import Color from '../color';
import ColorExtractor from '../color-extractor';
import { convertHslaToRgba } from '../../util/color-util';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_HUE = `\\d*${DOT_VALUE}?`;
const R_SATURATION = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_LUMINANCE = R_SATURATION;
const R_ALPHA = `([ ,]\\s*${ALPHA}\\s*|\\s*\\/\\s*${R_SATURATION}%?\\s*)?`;

const HSL_NEW_SYNTAX = `hsla?\\(\\s*${R_HUE}(deg|turn)?\\s*\\s*${R_SATURATION}%?\\s*\\s*${R_LUMINANCE}%?\\s*${R_ALPHA}\\)`;
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
  const values = value
    .replace(/hsl(a){0,1}\(/, '')
    .replace(/\)/, '')
    .replace('/', ' ')
    .replaceAll(',', ' ')
    .split(/\s+/);

  let h = parseFloat(values[0]);

  if (/turn/.test(values[0])) {
    h = (h % 1) * 360;
  }

  const [s, l] = values.slice(1, 3).map(parseFloat);

  const isRelativeAlpha = /%/.test(values[3]);

  let a = parseFloat(values[3] ?? 1);

  if (!isRelativeAlpha && a > 1) {
    a = 1;
  }

  if (isRelativeAlpha && a > 100) {
    a = 1;
  }

  if (a > 1) {
    a = a / 100;
  }

  return [h, s, l, a];
}

function getColor(match: RegExpExecArray) {
  const value = match[1];
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
