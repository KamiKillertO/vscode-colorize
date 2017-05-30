import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';
// stylus no prefix needed and = instead of :
export const REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|\w(?:\w|-)*\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;

class VariablesExtractor {

  public name: string = 'VARIABLE_EXTRACTOR';

  public extractDeclarations(text: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      let match = null;
      let variablesDeclarations: string[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        variablesDeclarations.push(match[1]);
      }
      return resolve(variablesDeclarations);
    });
  }
}
const instance = new VariablesExtractor();

export default instance;

// WARNINGS

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
