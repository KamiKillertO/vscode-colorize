import ColorExtractor from '../color-extractor';
import ColorStrategy from './__strategy-base';
import { EOL, HEXA_VALUE } from '../../util/regexp';
import Color from '../color';

const HEXA_PREFIX = '(?:#|0x)';
export const REGEXP = new RegExp(
  `(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`,
  'gi'
);
export const REGEXP_ONE = new RegExp(
  `^(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`,
  'i'
);

function extractRGB(values: number[]): [number, number, number] {
  let rgb = values.slice(0, 6);
  if (values.length === 3 || values.length === 4) {
    const _rgb = values.slice(0, 3);
    rgb = [_rgb[0], _rgb[0], _rgb[1], _rgb[1], _rgb[2], _rgb[2]];
  }
  return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
}

function extractAlpha(values: number[]): number {
  if (values.length === 4) {
    const alpha = values[3];
    return (16 * alpha + alpha) / 255;
  }
  if (values.length === 8) {
    const alpha = values.slice(6, 8);
    return (16 * alpha[0] + alpha[1]) / 255;
  }
  return 1;
}

function removePrefix(argb: string): RegExpExecArray {
  return /(?:#|0x)(.+)/gi.exec(argb) as RegExpExecArray;
}
function hexaToInt(argb: string): number[] {
  return argb.split('').map((_) => parseInt(_, 16));
}
function getColor(match: RegExpExecArray): Color {
  const value = match[1];
  const str = removePrefix(value)[1];
  const values = hexaToInt(str);
  const rgb = extractRGB(values);
  const alpha = extractAlpha(values);
  return new Color(value, match.index, rgb, alpha);
}

const strategy = new ColorStrategy('HEXA', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
