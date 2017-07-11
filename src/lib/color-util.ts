import Color from './color';
import './extractors/hexa-extractor';
import './extractors/rgb-extractor';
import './extractors/browser-extractor';
import './extractors/hsl-extractor';
import ColorExtractor from './extractors/color-extractor';
import VariablesExtractor from './extractors/variables-extractor';

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
  public static findColors(text): Promise < Color[] > {
    return ColorExtractor.extract(text);
  }

  public static findColorVariables(text): Promise <Set<String>> {
    return VariablesExtractor.extractDeclarations(text);
  }
}
export default ColorUtil;
