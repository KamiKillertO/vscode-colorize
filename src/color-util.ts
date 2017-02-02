import {
  HEXA_COLOR,
  RGB_COLOR
} from './color-regex';
import Color from './color';

// Flatten Array
// flatten(arr[[1,2,3],[4,5]]) -> arr[1,2,3,4,5]
const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

class ColorUtil {

  public static luminance(color: Color): number {
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

  public static findColors(text): Promise < Color[] > {
    return Promise.all([
      this._extractHexa(text),
      this._extractRGB(text)
    ]).then(colors => {
      return flatten(colors);
    });
  }


  public static match(text: string, model: string): boolean {
    switch (model) {
      case 'hexa':
        return !!text.match(HEXA_COLOR);
      default:
        return false;
    }
  }

  private static _extractHexa(text: string): Promise < Color[] > {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];
      while ((match = HEXA_COLOR.exec(text)) !== null) {
        colors.push(new Color('hexa', match[1], match.index));
      }
      return resolve(colors);
    });
  }

  private static _extractRGB(text: string): Promise < Color[] > {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];
      // Get rgb "like" colors
      while ((match = RGB_COLOR.exec(text)) !== null) {
        let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
        // Check if it's a valid rgb(a) color
        if (rgba.slice(0, 3).every(c => c <= 255) && (rgba[4] || 1) <= 1) {
          colors.push(new Color('rgb', match[0], match.index));
        }
      }
      return resolve(colors);
    });
  }
};
export default ColorUtil;
