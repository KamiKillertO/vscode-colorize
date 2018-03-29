import Color from './../color';
import ColorExtractor, { IColorStrategy } from '../color-extractor';
import color from './../color';
import { LineExtraction, DocumentLine } from '../../color-util';

export const REGEXP = /(#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8})(?:$|"|'|,| |;|\)|\r|\n)/gi;
export const REGEXP_ONE = /^(#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8})(?:$|"|'|,| |;|\)|\r|\n)/i;

class HexaColorExtractor implements IColorStrategy {
  public name: string = 'HEXA_EXTRACTOR';

  private extractRGBValue(value): number[] {
    let rgb: any = /#(.+)/gi.exec(value);
    if (rgb[1].length === 3 || rgb[1].length === 4) {
      return rgb[1].split('').slice(0, 3).map(_ => parseInt(_ + _, 16));
    }
    rgb = rgb[1].split('').slice(0, 6).map(_ => parseInt(_, 16));
    return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
  }
  private extractAlphaValue(value): number {
    let rgb: any = /#(.+)/gi.exec(value);
    if (rgb[1].length === 4) {
      let alpha = rgb[1][3];
      return (parseInt(`${alpha}${alpha}`, 16) / 255);
    }
    if (rgb[1].length === 8) {
      let alpha = rgb[1].slice(6, 8);
      return (parseInt(alpha, 16) / 255);
    }
    return 1;
  }
  public async extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    return fileLines.map(({line, text}) => {
      let match = null;
      let colors: Color[] = [];

      while ((match = REGEXP.exec(text)) !== null) {
        const m = match[1];
        colors.push(new Color(m, match.index, this.extractRGBValue(m), this.extractAlphaValue(m)));
      }
      return {
        line,
        colors
      };
    });
  }
  public extractColor(text: string, fileName = null): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match) {
      return new Color(match[1], match.index, this.extractRGBValue(match[1]));
    }
    return null;
  }
}

ColorExtractor.registerStrategy(new HexaColorExtractor());
export default HexaColorExtractor;
