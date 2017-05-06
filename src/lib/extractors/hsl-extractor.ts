import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';


export const REGEXP = /((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;

class HSLColorExtractor implements IColorExtractor {
  public name: string = 'HSL_EXTRACTOR';

  /**
   * #see http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
   *
   * @private
   * @param {number} h
   * @param {number} s
   * @param {number} l
   * @param {number} [a=1]
   * @returns {number[]} The colors converted in rgba
   *
   * @memberof HSLColorExtractor
   */
  private convertToRGBA(h: number, s: number, l: number, a: number = 1): number[] {
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

    r = this.executeProperFormula(tmp_1, temp_2, tmp_r);
    g = this.executeProperFormula(tmp_1, temp_2, tmp_g);
    b = this.executeProperFormula(tmp_1, temp_2, tmp_b);

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
  private executeProperFormula(tmp_1: number, tmp_2: number, value: number): number {
    if (6 * value < 1) {
      return tmp_2 + (tmp_1 - tmp_2) * 6 * value;
    }
    if (2 * value < 1) {
      return tmp_1;
    }
    if ( 3 * value < 2) {
      return tmp_2 + (tmp_1 - tmp_2) * (0.666 - value) * 6;
    }

    return tmp_2;
  }

  public extractColors(text: string) {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        let [h, s, l, a]: number[] = match[1].replace(/hsl(a){0,1}\(/, '').replace(/\)/, '').replace(/%/g, '').split(/,/gi).map(c => parseFloat(c));
        if (s <= 100 && l <= 100) {
          let [r, g, b] = this.convertToRGBA(h, s, l, a);
          colors.push(new Color(match[1], match.index, 1, [r, g, b]));
        }
      }
      return resolve(colors);
    });
  }
}
ColorExtractor.registerExtractor(new HSLColorExtractor());

 export default HSLColorExtractor;
