import { IColorExtractor } from './color-extractor';
import ColorExtractor from './color-extractor';
import Color from './../color';

export const REGEXP = /((?:rgb\((?:\d{1,3}\s*,\s*){2}\d{1,3}\))|(?:rgba\((?:\d{1,3}\s*,\s*){3}[0-1](?:\.\d+){0,1}\)))(?:$|"|'|,| |;|\)|\n)/gi;

class RgbExtractor implements IColorExtractor {
  public name: string = 'RGB_EXTRACTOR';

  private extractRGBAValue(value): number[] {
    let rgba =  value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
    return rgba.slice(0, 3);
    // this.alpha = rgba[4] || 1;
  }

  public extractColors(text: string): Promise<Color[]> {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];
      // Get rgb "like" colors
      while ((match = REGEXP.exec(text)) !== null) {
        let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
        // Check if it's a valid rgb(a) color
        if (rgba.slice(0, 3).every(c => c <= 255) && (rgba[4] || 1) <= 1) {
          colors.push(new Color(match[1], match.index, 1, this.extractRGBAValue(match[1])));
        }
      }
      return resolve(colors);
    });
  }
  // public constructor(value: string, positionInText: number = 0) {
  //   this.value = value;
  //   this.positionInText = positionInText;
  //   this._extractRGBAValue();
  // }

  // public toRgbString(): string {
  //   return `rgb(${this.rgb.join(',')})`;
  // }

  // private _extractRGBAValue(): void {
  //   let rgba =  this.value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
  //   this.rgb = rgba.slice(0, 3);
  //   this.alpha = rgba[4] || 1;
  // }
  // public static REGEXP: RegExp = RegExp("");
}
ColorExtractor.registerExtractor(new RgbExtractor());
export default RgbExtractor;
