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
exports.REGEXP = /(#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8})(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP_ONE = /^(#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8})(?:$|"|'|,| |;|\)|\r|\n)/i;
class HexaColorExtractor {
    constructor() {
        this.name = 'HEXA_EXTRACTOR';
    }
    extractRGBValue(value) {
        let rgb = /#(.+)/gi.exec(value);
        if (rgb[1].length === 3 || rgb[1].length === 4) {
            return rgb[1].split('').slice(0, 3).map(_ => parseInt(_ + _, 16));
        }
        rgb = rgb[1].split('').slice(0, 6).map(_ => parseInt(_, 16));
        return [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
    }
    extractAlphaValue(value) {
        let rgb = /#(.+)/gi.exec(value);
        if (rgb[1].length === 4) {
            let alpha = rgb[1][3];
            return (parseInt(`${alpha}${alpha}`, 16) / 255);
        }
        if (rgb[1].length === 8) {
            let alpha = rgb[1].slice(6, 8);
            return (parseInt(alpha, 16) / 255);
        }
        return 1;
    }
    extractColors(text, fileName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            let colors = [];
            while ((match = exports.REGEXP.exec(text)) !== null) {
                colors.push(new color_1.default(match[1], match.index, this.extractAlphaValue(match[1]), this.extractRGBValue(match[1])));
            }
            return colors;
        });
    }
    extractColor(text, fileName = null) {
        let match = text.match(exports.REGEXP_ONE);
        if (match) {
            return new color_1.default(match[1], match.index, 1, this.extractRGBValue(match[1]));
        }
        return null;
    }
}
color_extractor_1.default.registerExtractor(new HexaColorExtractor());
exports.default = HexaColorExtractor;
//# sourceMappingURL=hexa-extractor.js.map