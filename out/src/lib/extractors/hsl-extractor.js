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
const color_1 = require("./../color");
const color_extractor_1 = require("./color-extractor");
exports.REGEXP = /((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP_ONE = /^((?:hsl\(\d*\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\))|(?:hsla\(\d*\s*,\s*(?:\d{1,3}%\s*,\s*){2}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;
class HSLColorExtractor {
    constructor() {
        this.name = 'HSL_EXTRACTOR';
    }
    generateColorFromMatch(match) {
        const [h, s, l, a] = this.extractHSLValue(match[1]);
        if (s <= 100 && l <= 100) {
            let [r, g, b] = this.convertToRGBA(h, s, l, a);
            return new color_1.default(match[1], match.index, 1, [r, g, b]);
        }
        return null;
    }
    /**
     * @private
     * @param {any} value An hsl(a) color string (`hsl(10, 1%, 1%)`)
     * @returns {number[]} The colors h,s,l,a values
     *
     * @memberof HSLColorExtractor
     */
    extractHSLValue(value) {
        const [h, s, l, a] = value.replace(/hsl(a){0,1}\(/, '').replace(/\)/, '').replace(/%/g, '').split(/,/gi).map(c => parseFloat(c));
        return [h, s, l, a];
    }
    /**
     * #see http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
     *
     * @private
     * @param {number} h
     * @param {number} s
     * @param {number} l
     * @param {number} [a=1]
     * @returns {number[]} The colors converted in rgba
     *
     * @memberof HSLColorExtractor
     */
    convertToRGBA(h, s, l, a = 1) {
        let r, g, b;
        if (s === 0) {
            r = g = b = Math.round((l / 100) * 255);
            return [r, g, b, a];
        }
        l = l / 100;
        s = s / 100;
        let tmp_1 = (l < 0.5) ? l * (1.0 + s) : l + s - l * s;
        let temp_2 = 2 * l - tmp_1;
        h = (h % 360) / 360;
        let tmp_r = (h + 0.333) % 1;
        let tmp_g = h;
        let tmp_b = h - 0.333;
        if (tmp_b < 0) {
            tmp_b = tmp_b + 1;
        }
        r = this.executeProperFormula(tmp_1, temp_2, tmp_r);
        g = this.executeProperFormula(tmp_1, temp_2, tmp_g);
        b = this.executeProperFormula(tmp_1, temp_2, tmp_b);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
    }
    /**
     * Select and execute the proper formula to get the r,g,b values
     *
     * @private
     * @param {number} tmp_1
     * @param {number} tmp_2
     * @param {number} value
     * @returns {number}
     *
     * @memberof HSLColorExtractor
     */
    executeProperFormula(tmp_1, tmp_2, value) {
        if (6 * value < 1) {
            return tmp_2 + (tmp_1 - tmp_2) * 6 * value;
        }
        if (2 * value < 1) {
            return tmp_1;
        }
        if (3 * value < 2) {
            return tmp_2 + (tmp_1 - tmp_2) * (0.666 - value) * 6;
        }
        return tmp_2;
    }
    extractColors(text, fileName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            let colors = [];
            while ((match = exports.REGEXP.exec(text)) !== null) {
                const color = this.generateColorFromMatch(match);
                if (color !== null) {
                    colors.push(color);
                }
            }
            return colors;
        });
    }
    extractColor(text) {
        let match = text.match(exports.REGEXP_ONE);
        if (match) {
            const color = this.generateColorFromMatch(match);
            if (color !== null) {
                return color;
            }
        }
        return null;
    }
}
color_extractor_1.default.registerExtractor(new HSLColorExtractor());
exports.default = HSLColorExtractor;
//# sourceMappingURL=hsl-extractor.js.map