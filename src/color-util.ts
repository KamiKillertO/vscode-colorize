import {
  HEXA_COLOR
} from './color-regex';
import Color from './color';

// Flatten Array
// flatten(arr[[1,2,3],[4,5]]) -> arr[1,2,3,4,5]
const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
class ColorUtil {
  public static getRGB(color: Color): number[] {
    let rgb: any[] = [];
    if (color.model === 'hexa') {
      rgb = /#(.+)/gi.exec(color.value);
      if (rgb[1].length === 3) {
        return rgb[1].split('').map(_ => parseInt(_ + _, 16));
      }
      rgb = rgb[1].split('').map(_ => parseInt(_, 16));
      return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
    }
    return [];
  }

  public static luminance(color: Color): number {
    let rgb = this.getRGB(color);
    if (!rgb) {
      return null;
    }
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
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  public static findColors(text): Promise < Color[] > {
    return Promise.all([
      this._extractHexa(text),
      this._extractRGB(text)
    ]).then(colors => { // need to flat
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

};
export default ColorUtil;
