"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./extractors/hexa-extractor");
require("./extractors/rgb-extractor");
require("./extractors/browser-extractor");
require("./extractors/hsl-extractor");
const color_extractor_1 = require("./extractors/color-extractor");
const variables_extractor_1 = require("./extractors/variables-extractor");
const color_decoration_1 = require("./color-decoration");
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
    static findColors(text, fileName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = yield color_extractor_1.default.extract(text, fileName);
            return colors;
        });
    }
    static findColorVariables(fileName, text, line) {
        return variables_extractor_1.default.extractDeclarations(fileName, text, line);
    }
    static generateDecoration(color) {
        if ('declaration' in color) {
            return new color_decoration_1.default(color.color);
        }
        const deco = new color_decoration_1.default(color);
        if ('_variable' in color) {
            color._variable.registerObserver(deco);
        }
        return deco;
    }
}
exports.default = ColorUtil;
//# sourceMappingURL=color-util.js.map