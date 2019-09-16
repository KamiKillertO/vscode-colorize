import Color from '../color';
import ColorExtractor, { IColorStrategy } from '../color-extractor';
import { LineExtraction, DocumentLine } from '../../util/color-util';
import { EOL, HEXA_VALUE } from '../../util/regexp';

const HEXA_PREFIX = '(?:#|0x)';
export const REGEXP = new RegExp(`(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(${HEXA_PREFIX}(?:${HEXA_VALUE}{3,4}|${HEXA_VALUE}{6}|${HEXA_VALUE}{8}))${EOL}`, 'i');

class ARGBColorExtractor implements IColorStrategy {
  public name: string = 'ARGB';

  private extractRGBValue(value): number[] {
    let rgb: any = /#(.+)/gi.exec(value);
    if (rgb[1].length === 3) {
      return rgb[1].split('').map(_ => parseInt(_ + _, 16));
    }
    if (rgb[1].length === 4) {
      return rgb[1].split('').slice(1, 4).map(_ => parseInt(_ + _, 16));
    }
    if (rgb[1].length === 8) {
      rgb[1] = rgb[1].slice(2);
    }
    rgb = rgb[1].split('').map(_ => parseInt(_, 16));
    return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
  }
  private extractAlphaValue(value): number {
    let rgb: any = /#(.+)/gi.exec(value);
    if (rgb[1].length === 4) {
      let alpha = rgb[1][0];
      return (parseInt(`${alpha}${alpha}`, 16) / 255);
    }
    if (rgb[1].length === 8) {
      let alpha = rgb[1].slice(0, 2);
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

ColorExtractor.registerStrategy(new ARGBColorExtractor());
export default ARGBColorExtractor;
