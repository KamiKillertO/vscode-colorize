import Color, {IColor} from '../colors/color';
import '../colors/strategies/hexa-strategy';
import '../colors/strategies/rgb-strategy';
import '../colors/strategies/browser-strategy';
import '../colors/strategies/hsl-strategy';
import ColorExtractor from '../colors/color-extractor';
import ColorDecoration from '../colors/color-decoration';
import { Range, TextEditorDecorationType } from 'vscode';

interface DocumentLine {
  line: number;
  text: string;
}

interface LineExtraction {
  line: number;
  colors: IColor[];
}

const flattenLineExtractionsFlatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flattenLineExtractionsFlatten(b) : b), []).filter(_ => _.colors.length !== 0);

const WHITE = '#FFFFFF',
      BLACK = '#000000';

interface IDecoration {
  decoration: TextEditorDecorationType;
  /**
   * Dispose the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf IDecoration
   */
  dispose(): void;

  /**
   * Hide the TextEditorDecorationType
   *
   * @public
   * @memberOf IDecoration
   */
  hide(): void;

  /**
   * Is `true` when the decoration has been destroyed, `false` otherwise.
   *
   * @public
   * @memberOf IDecoration
   */
  disposed: Boolean;

  /**
   * Generate the decoration Range (start and end position in line)
   *
   * @param {number} line
   * @returns {Range}
   *
   * @memberOf ColorDecoration
   */
  generateRange(line: number): Range;
}

class ColorUtil {
  public static textToFileLines(text: string): DocumentLine[] {
    return text.split(/\n/)
                .map((text, index) => Object({
                  'text': text,
                  'line': index
                }));
  }
  /**
   * Extract all colors from a text
   *
   * @static
   * @param {any} text
   * @returns {Promise < Color[] >}
   *
   * @memberOf ColorUtil
   */
  public static findColors(fileContent: DocumentLine[], fileName = null): Promise < LineExtraction[] > {
    return ColorExtractor.extract(fileContent);
  }

  public static setupColorsExtractors(extractors: string[]) {
    ColorExtractor.enableStrategies(extractors);
  }

  public static generateDecoration(color: IColor): IDecoration {
    return new ColorDecoration(<Color>color);
  }
}


  /**
   * Generate the color luminance.
   * The luminance value is between 0 and 1
   * - 1 means that the color is light
   * - 0 means that the color is dark
   *
   * @static
   * @param {Color} color
   * @returns {number}
   */
function colorLuminance(color: Color): number {
  let rgb = color.rgb;
  rgb = rgb.map(c => {
    c = c / 255;
    if (c < 0.03928) {
      c = c / 12.92;
    } else {
      c = (c + .055) / 1.055;
      c = Math.pow(c, 2.4);
    }
    return c;
  });
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
}

function generateOptimalTextColor(color: Color): string {
  const luminance: number = colorLuminance(color);
  const contrastRatioBlack: number = (luminance + 0.05) / 0.05;
  if (contrastRatioBlack > 7) {
    return BLACK;
  }
  const contrastRatioWhite: number = 1.05 / (luminance + 0.05);
  if (contrastRatioWhite > 7) {
    return WHITE;
  }
  if (contrastRatioBlack > contrastRatioWhite) {
    return BLACK;
  }
  return WHITE;
}
  /**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @param   {number}  a       The alpha value
 *
 * @return  {[number, number, number, number]} [h,s,l,a] - The HSLa representation
 */
function convertRgbaToHsla (r: number, g: number, b: number, a: number = 1): [number, number, number, number] {
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    return [0, 0, Math.round(l * 100), a]; // achromatic
  }
  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
  }
  h /= 6;
  return [ Math.round(360 * h), Math.round(100 * s), Math.round(l * 100), a ];
}
/**
 * Converts an HSLa color value to RGBa. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *
 * @param {number} h - The hue
 * @param {number} s - The saturation
 * @param {number} l - The lightness
 * @param {number} a - The alpha
 *
 * @return  {[number, number, number, number]} [r,g,b,a] - The RGBa representation
 */
function convertHslaToRgba(h: number, s: number, l: number, a: number = 1): [number, number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = Math.round((l / 100) * 255);
    return [r, g, b, a];
  }
  l = l / 100;
  s = s / 100;
  let tmp_1 = (l < 0.5) ? l * (1.0 + s) : l + s - l * s;

  let temp_2 = 2 * l - tmp_1;
  h = (h % 360) / 360;

  let tmp_r = (h + 0.333) % 1;
  let tmp_g = h;
  let tmp_b = h - 0.333;
  if (tmp_b < 0) {
    tmp_b = tmp_b + 1;
  }

  r = executeHSLProperFormula(tmp_1, temp_2, tmp_r);
  g = executeHSLProperFormula(tmp_1, temp_2, tmp_g);
  b = executeHSLProperFormula(tmp_1, temp_2, tmp_b);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}
/**
 * Select and execute the proper formula to get the r,g,b values
 *
 * @private
 * @param {number} tmp_1
 * @param {number} tmp_2
 * @param {number} value
 * @returns {number}
 *
 * @memberof HSLColorExtractor
 */
function executeHSLProperFormula(tmp_1: number, tmp_2: number, value: number): number {
  let res = tmp_2;
  if (6 * value < 1) {
    return tmp_2 + (tmp_1 - tmp_2) * 6 * value;
  }
  if (2 * value < 1) {
    return tmp_1;
  }
  if ( 3 * value < 2) {
    return tmp_2 + (tmp_1 - tmp_2) * ((2 / 3) - value) * 6;
  }

  return res;
}

export default ColorUtil;

export { IDecoration, convertHslaToRgba, colorLuminance, convertRgbaToHsla, generateOptimalTextColor, flattenLineExtractionsFlatten, LineExtraction, DocumentLine };
