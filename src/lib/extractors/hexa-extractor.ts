import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';

export const REGEXP = /(#[\da-f]{3}|#[\da-f]{6})(?:$|"|'|,| |;|\)|\r|\n)/gi;

class HexaColorExtractor implements IColorExtractor {
  public name: string = 'HEXA_EXTRACTOR';

  private extractRGBValue(value): number[] {
    let rgb: any = /#(.+)/gi.exec(value);
    if (rgb[1].length === 3) {
      return rgb[1].split('').map(_ => parseInt(_ + _, 16));
    }
    rgb = rgb[1].split('').map(_ => parseInt(_, 16));
    return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
  }
  public extractColors(text: string) {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];

      while ((match = REGEXP.exec(text)) !== null) {
        colors.push(new Color(match[1], match.index, 1, this.extractRGBValue(match[1])));
      }
      return resolve(colors);
    });
  }
}
ColorExtractor.registerExtractor(new HexaColorExtractor());

  // public value: string;
  // public rgb: number[];
  // public alpha: number;
  // public positionInText: number;

  // public constructor(value: string, positionInText: number = 0) {
  //   this.value = value;
  //   this.positionInText = positionInText;
  //   this.alpha = 1;
  //   this.rgb = this._extractRGBValue();
  // }

  // public toRgbString(): string {
  //   return `rgb(${this.rgb.join(',')})`;
  // }

// }
 export default HexaColorExtractor;
