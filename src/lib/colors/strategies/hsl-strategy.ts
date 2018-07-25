import Color from './../color';
import ColorExtractor, { IColorStrategy } from '../color-extractor';
import { convertHslaToRgba } from '../../color-util';
import { LineExtraction, DocumentLine } from '../../color-util';


export const REGEXP = /((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
export const REGEXP_ONE = /^((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;

class HSLColorExtractor implements IColorStrategy {
  public name: string = 'HSL';

  private generateColorFromMatch(match: RegExpMatchArray): Color {
    const [h, s, l, a] = this.extractHSLValue(match[1]);
    if (s <= 100 && l <= 100) {
      let [r, g, b] = convertHslaToRgba(h, s, l, a);
      return new Color(match[1], match.index, [r, g, b]);
    }
    return null;
  }

  /**
   * @private
   * @param {any} value An hsl(a) color string (`hsl(10, 1%, 1%)`)
   * @returns {number[]} The colors h,s,l,a values
   *
   * @memberof HSLColorExtractor
   */
  private extractHSLValue(value) {
    const [h, s, l, a]: number[] = value.replace(/hsl(a){0,1}\(/, '').replace(/\)/, '').replace(/%/g, '').split(/,/gi).map(c => parseFloat(c));
    return [h, s, l, a];
  }

  public async extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    return fileLines.map(({line, text}) => {
      let match = null;
      let colors: Color[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        const color = this.generateColorFromMatch(match);
        if (color !== null) {
          colors.push(color);
        }
      }
      return {
        line,
        colors
      };
    });
  }
  public extractColor(text: string): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match) {
      const color = this.generateColorFromMatch(match);
      if (color !== null) {
        return color;
      }
    }
    return null;
  }
}

ColorExtractor.registerStrategy(new HSLColorExtractor());
export default HSLColorExtractor;
