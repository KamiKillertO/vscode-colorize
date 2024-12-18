import ColorExtractor from '../color-extractor';
import ColorStrategy from './__strategy-base';
import { EOL, HEXA_VALUE } from '../../util/regexp';
import Color from '../color';

const HEXA_PREFIX = '(?:#|0x)';
export const REGEXP = new RegExp(
  `(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`,
  'gi',
);
export const REGEXP_ONE = new RegExp(
  `^(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`,
  'i',
);

function extractRGB(argb: number[]) {
  let rgb = argb.slice(-6);

  if (argb.length === 3 || argb.length === 4) {
    const _argb = argb.slice(-3);
    rgb = [_argb[0], _argb[0], _argb[1], _argb[1], _argb[2], _argb[2]];
  }

  return [
    16 * rgb[0] + rgb[1],
    16 * rgb[2] + rgb[3],
    16 * rgb[4] + rgb[5],
  ] as const;
}

function extractAlpha(argb: number[]) {
  if (argb.length === 4) {
    const alpha = argb[0];
    return (16 * alpha + alpha) / 255;
  }

  if (argb.length === 8) {
    const alpha = argb.slice(0, 2);
    return (16 * alpha[0] + alpha[1]) / 255;
  }

  return 1;
}

function removePrefix(argb: string) {
  return /(?:#|0x)(.+)/gi.exec(argb) as RegExpExecArray;
}

function hexaToInt(argb: string) {
  return argb.split('').map((_) => parseInt(_, 16));
}

function getColor(match: RegExpExecArray) {
  const value = match[1];
  const argb = removePrefix(value)[1];
  const values = hexaToInt(argb);
  const rgb = extractRGB(values);
  const alpha = extractAlpha(values);
  return new Color(value, match.index, rgb, alpha);
}

const strategy = new ColorStrategy('ARGB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
