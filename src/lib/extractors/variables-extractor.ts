import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';

// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names 
export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;

export const REGEXP_ONE = /^(?:((?:(?:\$|@)(?:\w|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;

//second group == undefined with css variables >< 

class VariablesExtractor {

  public name: string = 'VARIABLE_EXTRACTOR';

  public extractDeclarations(text: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      let match = null;
      let variablesDeclarations: string[] = [];
      while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
        // match[2] for stylus
        variablesDeclarations.push(match[1] || match[2]);
      }
      return resolve(variablesDeclarations);
    });
  }
}
const instance = new VariablesExtractor();

export default instance;

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
