import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';

// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
// export const REGEXP = /(?:((?:(?:\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;

export const REGEXP_ONE = /^(?:((?:(?:\$|@)(?:\w|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;

class VariablesExtractor implements IColorExtractor {

  public variablesDeclarations: Object = {};

  public name: string = 'VARIABLE_EXTRACTOR';

  public extractColors(text: string): Promise<Color[]> {
    return new Promise((resolve, reject) => {
      let match = null;
      let colors: Color[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        // match[3] for css variables
        let varName =  match[1] || match[3];
        // match[2] for css variables
        let value =  match[1] || match[2];
        if (this.variablesDeclarations[varName]) {
          colors.push(new Color(value, match.index, 1, this.variablesDeclarations[varName]));
        }
      }
      return resolve(colors);
    });
  }

  public extractColor(text: string): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match && this.variablesDeclarations[match[0]]) {
      return new Color(match[1], match.index, 1, this.variablesDeclarations[match[0]]);
    }
    return null;
  }

  public extractDeclarations(text: string): Promise<Set<string>> {
    return new Promise((resolve, reject) => {
      let match = null;
      let variablesDeclarations: Set<string> = new Set();
      while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
        // match[2] for stylus
        variablesDeclarations.add(match[1] || match[2]);
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
