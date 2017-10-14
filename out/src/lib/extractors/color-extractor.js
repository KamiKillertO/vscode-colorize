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
const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
class ColorExtractor {
    constructor() {
        this.extractors = [];
    }
    registerExtractor(extractor) {
        if (!this.has(extractor)) {
            this.extractors.push(extractor);
        }
    }
    has(extractor) {
        if (typeof extractor === 'string') {
            return this.extractors.some(_ => _.name === extractor);
        }
        return this.extractors.some(_ => _.name === extractor.name);
    }
    get(extractor) {
        if (this.has(extractor) === false) {
            return null;
        }
        return this.extractors.find(_ => _.name === extractor);
    }
    extract(text, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = yield Promise.all(this.extractors.map(extractor => extractor.extractColors(text, fileName)));
            return flatten(colors);
        });
    }
    extractOneColor(text) {
        let colors = this.extractors.map(extractor => extractor.extractColor(text));
        return colors.find(color => color !== null);
    }
}
const instance = new ColorExtractor();
exports.default = instance;
//# sourceMappingURL=color-extractor.js.map