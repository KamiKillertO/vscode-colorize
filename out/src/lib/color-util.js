"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./extractors/hexa-extractor");
require("./extractors/rgb-extractor");
require("./extractors/browser-extractor");
require("./extractors/hsl-extractor");
const color_extractor_1 = require("./extractors/color-extractor");
const variables_extractor_1 = require("./extractors/variables-extractor");
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
    static luminance(color) {
        let rgb = color.rgb;
        rgb = rgb.map(c => {
            c = c / 255;
            if (c < 0.03928) {
                c = c / 12.92;
            }
            else {
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
    static findColors(text) {
        return color_extractor_1.default.extract(text);
    }
    static findColorVariables(text) {
        return variables_extractor_1.default.extractDeclarations(text);
    }
}
exports.default = ColorUtil;
//# sourceMappingURL=color-util.js.map