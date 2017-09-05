import Color, {IColor} from './colors/color';
import Variable from './variables/variable';
import './colors/extractors/hexa-extractor';
import './colors/extractors/rgb-extractor';
import './colors/extractors/browser-extractor';
import './colors/extractors/hsl-extractor';
import ColorExtractor from './colors/color-extractor';
import ColorDecoration from './colors/color-decoration';
import { Range, TextEditorDecorationType } from 'vscode';

interface IDecoration {
  decoration: TextEditorDecorationType;
  /**
   * Disposed the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf IDecoration
   */
  dispose(): void;
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

  /**
   * Generate the color luminance.
   * The luminance value is between 0 and 1
   * - 1 means that the color is light
   * - 0 means that the color is dark
   *
   * @static
   * @param {Color} color
   * @returns {number}
   *
   * @memberOf ColorUtil
   */
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
  /**
   * Extract all colors from a text
   *
   * @static
   * @param {any} text
   * @returns {Promise < Color[] >}
   *
   * @memberOf ColorUtil
   */
   public static async findColors(text, fileName = null): Promise < IColor[] > {
    const colors = await ColorExtractor.extract(text);
    return colors;
   }

  public static generateDecoration(color: IColor): IDecoration {
    return new ColorDecoration(<Color>color);
  }
}
export default ColorUtil;

export { IDecoration };
