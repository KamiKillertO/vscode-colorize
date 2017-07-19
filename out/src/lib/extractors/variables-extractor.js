"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./../color");
const color_extractor_1 = require("./color-extractor");
// stylus no prefix needed and = instead of :
exports.DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
exports.REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP_ONE = /^(?:((?:(?:\$|@)(?:\w|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;
class VariablesExtractor {
    constructor() {
        // public variablesDeclarations: Set<string> = new Set(); // use a map insteag (colorName: color)
        this.variablesDeclarations = new Map(); // use a map insteag (colorName: color)
        this.name = 'VARIABLE_EXTRACTOR';
    }
    extractColors(text) {
        const variablesDeclarations = this.variablesDeclarations;
        return new Promise((resolve, reject) => {
            let match = null;
            let colors = [];
            while ((match = exports.REGEXP.exec(text)) !== null) {
                // match[3] for css variables
                let varName = match[1] || match[3];
                // match[2] for css variables
                let value = match[1] || match[2];
                if (this.variablesDeclarations.has(varName)) {
                    colors.push(new color_1.default(value, match.index, 1, this.variablesDeclarations.get(varName).rgb));
                }
            }
            return resolve(colors);
        });
    }
    extractColor(text) {
        let match = text.match(exports.REGEXP_ONE);
        if (match && this.variablesDeclarations[match[0]]) {
            return new color_1.default(match[1], match.index, 1, this.variablesDeclarations[match[0]]);
        }
        return null;
    }
    extractDeclarations(text) {
        return new Promise((resolve, reject) => {
            let match = null;
            let variablesDeclarations = new Map();
            while ((match = exports.DECLARATION_REGEXP.exec(text)) !== null) {
                let color = color_extractor_1.default.extractOneColor(text.slice(match.index + match[0].length).trim());
                if (color) {
                    // match[2] for stylus
                    variablesDeclarations.set(match[1] || match[2], color);
                }
            }
            this.variablesDeclarations = variablesDeclarations;
            return resolve(variablesDeclarations);
        });
    }
}
const instance = new VariablesExtractor();
color_extractor_1.default.registerExtractor(instance);
exports.default = instance;
// WARNINGS/Questions
//  allow space between var name and ':' ?
// css
//
// is --bar--foo valid?
// Less
//
// This is valid
// @fnord:  "I am fnord.";
// @var:    "fnord";
// content: @@var;
// give => content: "I am fnord.";
// ?? reserved css "at-rules" ??
// should be excluded or not ? (less/linter should generate an error)
// @charset
// @import
// @namespace
// @media
// @supports
// @document
// @page
// @font-face
// @keyframes
// @viewport
// @counter-style
// @font-feature-values
// @swash
// @ornaments
// @annotation
// @stylistic
// @styleset
// @character-variant)
//# sourceMappingURL=variables-extractor.js.map