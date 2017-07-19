"use strict";
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
            return !!this.extractors.find(_ => _.name === extractor);
        }
        return !!this.extractors.find(_ => _.name === extractor.name);
    }
    extract(text) {
        let start = Date.now();
        return Promise.all(this.extractors.map(extractor => extractor.extractColors(text))).then(colors => {
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