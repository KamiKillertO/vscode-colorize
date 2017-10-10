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
const color_extractor_1 = require("./color-extractor");
const color_1 = require("./../color");
exports.REGEXP = /((?:rgb\((?:\d{1,3}\s*,\s*){2}\d{1,3}\))|(?:rgba\((?:\d{1,3}\s*,\s*){3}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP_ONE = /^((?:rgb\((?:\d{1,3}\s*,\s*){2}\d{1,3}\))|(?:rgba\((?:\d{1,3}\s*,\s*){3}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;
class RgbExtractor {
    constructor() {
        this.name = 'RGB_EXTRACTOR';
    }
    extractRGBAValue(value) {
        let rgba = value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
        return rgba.slice(0, 3);
    }
    extractColors(text, fileName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            let colors = [];
            // Get rgb "like" colors
            while ((match = exports.REGEXP.exec(text)) !== null) {
                let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
                // Check if it's a valid rgb(a) color
                if (rgba.slice(0, 3).every(c => c <= 255)) {
                    colors.push(new color_1.default(match[1], match.index, 1, this.extractRGBAValue(match[1])));
                }
            }
            return colors;
        });
    }
    extractColor(text) {
        let match = text.match(exports.REGEXP_ONE);
        if (match) {
            let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
            // Check if it's a valid rgb(a) color
            if (rgba.slice(0, 3).every(c => c <= 255)) {
                return new color_1.default(match[1], match.index, 1, this.extractRGBAValue(match[1]));
            }
        }
        return null;
    }
}
color_extractor_1.default.registerExtractor(new RgbExtractor());
exports.default = RgbExtractor;
//# sourceMappingURL=rgb-extractor.js.map