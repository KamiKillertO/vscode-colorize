import ColorExtractor from '../color-extractor';
import Color from '../color';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_RED = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_GREEN = R_RED;
const R_BLUE = R_RED;

const RGB_NEW_SYNTAX = `rgba?\\(\\s*${R_RED}%?\\s*${R_GREEN}%?\\s*${R_BLUE}%?(?:\\s*\\/\\s*(?:\\d{1,3}${DOT_VALUE}?|${ALPHA})?%?)?\\)`;
const RGB_LEGACY_SYNTAX = `rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\)`;
const RGBA_LEGACY_SYNTAX = `rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)`;

export const REGEXP = new RegExp(
  `(${RGB_LEGACY_SYNTAX}|${RGBA_LEGACY_SYNTAX}|${RGB_NEW_SYNTAX})${EOL}`,
  'gi',
);
export const REGEXP_ONE = new RegExp(
  `^(${RGB_LEGACY_SYNTAX}|${RGBA_LEGACY_SYNTAX}|${RGB_NEW_SYNTAX})${EOL}`,
  'i',
);

function extractRGBA(value: string) {
  const rgba_string = value
    .replace(/rgb(a){0,1}\(/, '')
    .replace(/\)/, '')
    .replace('/', ' ')
    .replaceAll(',', ' ');
  const values = rgba_string.split(/\s+/);

  const [r, g, b] = values.slice(0, 3).map((v) => {
    const value = parseFloat(v);

    if (v.includes('%')) {
      const percentage = value > 100 ? 100 : value;

      return (255 * percentage) / 100;
    }

    return value;
  });

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
  return [r, g, b, a];
}

function getColor(match: RegExpExecArray) {
  const value = match[1];
  const rgba = extractRGBA(value);

  const alpha = rgba[3] ?? 1;

  const rgb = rgba.slice(0, 3) as [number, number, number];
  // Check if it's a valid rgb(a) color
  if (rgb.every((c) => c <= 255)) {
    return new Color(match[1], match.index, rgb, alpha);
  }

  return null;
}

const strategy = new ColorStrategy('RGB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
