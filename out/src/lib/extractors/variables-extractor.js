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
const variable_1 = require("./../variable");
const color_extractor_1 = require("./color-extractor");
// stylus no prefix needed and = instead of :
exports.DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
// export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP = /(?:((?:(?:\s|\$|@)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
exports.REGEXP_ONE = /^(?:((?:(?:\$|@)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;
class VariablesExtractor {
    constructor() {
        this.variablesDeclarations_2 = new Map(); // use a map insteag (colorName: color)
        this.name = 'VARIABLE_EXTRACTOR';
    }
    has(variable = null, fileName = null, line = null) {
        const declarations = this.get(variable, fileName, line);
        return declarations && declarations.length > 0;
    }
    get(variable, fileName = null, line = null) {
        let decorations = this.variablesDeclarations_2.get(variable) || [];
        if (fileName === null) {
            return decorations;
        }
        decorations = decorations.filter(_ => _.declaration.fileName === fileName);
        if (line !== null) {
            decorations = decorations.filter(_ => _.declaration.line === line);
        }
        return decorations;
    }
    delete(variable, fileName, line) {
        let decorations = this.get(variable);
        if (decorations === undefined) {
            return;
        }
        if (fileName === null) {
            this.variablesDeclarations_2.delete(variable);
            return;
        }
        if (line !== null) {
            decorations = decorations.filter(_ => _.declaration.fileName === fileName && _.declaration.line !== line);
            this.variablesDeclarations_2.set(variable, decorations);
            return;
        }
        decorations = decorations.filter(_ => _.declaration.fileName !== fileName);
        this.variablesDeclarations_2.set(variable, decorations);
        return;
    }
    deleteVariableInLine(fileName, line) {
        const IT = this.variablesDeclarations_2.entries();
        let tmp = IT.next();
        while (tmp.done === false) {
            const varName = tmp.value[0];
            this.delete(varName, fileName, line);
            tmp = IT.next();
        }
    }
    extractColors(text, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            let colors = [];
            while ((match = exports.REGEXP.exec(text)) !== null) {
                // match[3] for css variables
                let varName = match[1] || match[3];
                // match[2] for css variables
                let value = match[1] || match[2];
                if (!this.has(varName)) {
                    continue;
                }
                let decorations = this.get(varName, fileName);
                decorations = decorations.sort((a, b) => a.declaration.line - b.declaration.line);
                if (decorations.length === 0) {
                    decorations = this.get(varName);
                }
                if (decorations.length === 0) {
                    this.variablesDeclarations_2.delete(varName);
                }
                let deco = decorations[decorations.length - 1];
                const color = new color_1.default(varName, match.index, deco.color.alpha, deco.color.rgb);
                color._variable = deco;
                // reference error >< multiple instance
                colors.push(color);
            }
            return colors;
        });
    }
    // Need to be updated
    extractColor(text) {
        let match = text.match(exports.REGEXP_ONE);
        if (match && this.has(match[0])) {
            const variable = [].concat(this.get(match[0]));
            return new color_1.default(match[0], match.index, 1, variable.pop().color.rgb);
        }
        return null;
    }
    extractDeclarations(fileName, text, line) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            while ((match = exports.DECLARATION_REGEXP.exec(text)) !== null) {
                let color = color_extractor_1.default.extractOneColor(text.slice(match.index + match[0].length).trim());
                if (color === null) {
                    continue;
                }
                const varName = match[1] || match[2];
                const variable = new variable_1.default(varName, color, { fileName, line });
                if (this.has(varName, fileName, line)) {
                    const decoration = this.get(varName, fileName, line);
                    decoration[0].updateColor(color);
                    continue;
                }
                if (this.has(varName)) {
                    const decorations = this.get(varName);
                    this.variablesDeclarations_2.set(varName, decorations.concat([variable]));
                }
                else {
                    this.variablesDeclarations_2.set(varName, [variable]);
                }
            }
            return this.variablesDeclarations_2;
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
// in sass order matter
//
// ```css
// $t: #fff
// $a: $t
// $t: #ccc
//
// p
//   color: $a
// ```
// here p.color === #fff
// in less order does not matter
//
// ```css
// @t: #fff
// @a: $t
// @t: #ccc
//
// p
//   color: @a
// ```
// here p.color === #ccc
// What about stylus, postcss ???
// should i always use the latest declaration in file?
// vcode-colorize only colorize (does not validate code ¯\_(ツ)_/¯)
//# sourceMappingURL=variables-extractor.js.map