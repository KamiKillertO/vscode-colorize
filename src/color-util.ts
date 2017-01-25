import { HEXA_COLOR } from './color-regex';
import Color from './color';

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
    rgb = rgb.map(_ => {
      _ = _ / 255;
      if (_ < 0.03928) {
        _ = _ / 12.92;
      } else {
        _ = (_ + .055) / 1.055;
        _ = Math.pow(_, 2.4);
      }
      return _;
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  public static extractColor(text: string):Color[] {
    let colors:Color[] = [];
    colors = colors.concat(this._extractHexa(text));
    return colors;
  }

  public static match(text: string, model: string):boolean {
    switch(model) {
      case 'hexa':
        return !!text.match(HEXA_COLOR);
      default:
        return false;
    }
  }
  
  private static _extractHexa(text: string): Color[] {
    let match = null;
    let colors:Color[] = [];
    while((match = HEXA_COLOR.exec(text)) !== null) {
      colors.push(new Color('hexa', match[1], match.index))
    }
    return colors;
  }
};
export default ColorUtil;
