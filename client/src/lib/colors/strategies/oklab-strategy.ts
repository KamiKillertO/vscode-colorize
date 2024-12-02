import Color from '../color';
import ColorExtractor from '../color-extractor';
import { DOT_VALUE, EOL } from '../../util/regexp';
import ColorStrategy from './__strategy-base';

const R_L = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_A = R_L;
const R_B = R_L;
const R_ALPHA = `(\\s*\\/\\s*${R_L}%?\\s*)?`;

const OKLAB_SYNTAX = `oklab?\\(\\s*${R_L}%?\\s*\\s*-?${R_A}%?\\s*\\s*-?${R_B}%?\\s*${R_ALPHA}\\)`;

export const REGEXP = new RegExp(`(${OKLAB_SYNTAX})${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(${OKLAB_SYNTAX})${EOL}`, 'i');

// function clamp(value: number, min: number, max: number) {
//   return Math.max(Math.min(value, max), min);
// }
// const linearToGamma = (c: number) =>
//   c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

// function oklabToSRGB(lightness: number, a: number, b: number) {
//   let l = lightness + a * 0.3963377774 + b * 0.2158037573;
//   let m = lightness + a * -0.1055613458 + b * -0.0638541728;
//   let s = lightness + a * -0.0894841775 + b * -1.291485548;

//   // The ** operator here cubes; same as l_*l_*l_ in the C++ example:
//   l = l ** 3;
//   m = m ** 3;
//   s = s ** 3;

//   let red = l * 4.0767416621 + m * -3.3077115913 + s * 0.2309699292;
//   let green = l * -1.2684380046 + m * 2.6097574011 + s * -0.3413193965;
//   let blue = l * -0.0041960863 + m * -0.7034186147 + s * 1.707614701;

//   // Convert linear RGB values returned from oklab math to sRGB for our use before returning them:
//   red = 255 * linearToGamma(red);
//   green = 255 * linearToGamma(green);
//   blue = 255 * linearToGamma(blue);

//   // OPTION: clamp r g and b values to the range 0-255; but if you use the values immediately to draw, JavaScript clamps them on use:
//   red = clamp(red, 0, 255);
//   green = clamp(green, 0, 255);
//   blue = clamp(blue, 0, 255);

//   // OPTION: round the values. May not be necessary if you use them immediately for rendering in JavaScript, as JavaScript (also) discards decimals on render:
//   red = Math.round(red);
//   green = Math.round(green);
//   blue = Math.round(blue);

//   return [red, green, blue] as const;
// }

// function extractLABValue(value: string) {
//   const values = value
//     .replace(/oklab\(/, '')
//     .replace(/\)/, '')
//     .replace('/', ' ')
//     .replaceAll(',', ' ')
//     .split(/\s+/);

//   let [l, a, b] = values.slice(0, 3).map(parseFloat);

//   if (/%/.test(values[0])) {
//     l /= 100;
//   }

//   if (/%/.test(values[1])) {
//     a = (Math.abs(a) * 0.4) / 100;
//   }

//   if (/%/.test(values[2])) {
//     b = (Math.abs(b) * 0.4) / 100;
//   }

//   const isRelativeAlpha = /%/.test(values[3]);

//   let alpha = parseFloat(values[3] ?? 1);

//   if (!isRelativeAlpha && a > 1) {
//     alpha = 1;
//   }

//   if (isRelativeAlpha && a > 100) {
//     alpha = 1;
//   }

//   if (a > 1) {
//     alpha = alpha / 100;
//   }

//   return [l, a, b, alpha];
// }

function getColor(match: RegExpExecArray) {
  // const value = match[0];
  // const [l, a, b, alpha] = extractLABValue(value);
  // return new Color(match[1], match.index, oklabToSRGB(l, a, b), alpha);

  // "TEMP" solution we actually don't need to convert colors to RGB to use them as decoration
  // but it can be useful for a conversion feature
  return new Color(match[1], match.index, [-1, -1, -1], -1);
}

const strategy = new ColorStrategy('OKLAB', REGEXP, REGEXP_ONE, getColor);
ColorExtractor.registerStrategy(strategy);
export default strategy;
