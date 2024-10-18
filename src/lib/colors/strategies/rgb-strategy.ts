import ColorExtractor from '../color-extractor';
import Color from '../color';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_RED = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_GREEN = R_RED;
const R_BLUE = R_RED;

export const REGEXP = new RegExp(
  `((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`,
  'gi',
);
export const REGEXP_ONE = new RegExp(
  `^((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`,
  'i',
);

function extractRGBA(value: string): number[] {
  const rgba_string = value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '');
  return rgba_string.split(/,/gi).map((c) => parseFloat(c));
}

function getColor(match: RegExpExecArray) {
  const value = match[1];
  const rgba = extractRGBA(value);
  const alpha = rgba[3] || 1;
  const rgb = rgba.slice(0, 3) as [number, number, number];
  // Check if it's a valid rgb(a) color
  if (rgb.every((c) => c <= 255)) {
    return new Color(match[1], match.index, rgb, alpha);
  }

  return null;
}

const strategy = new ColorStrategy('RGB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
