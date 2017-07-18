import Color from './../color';
import ColorExtractor, { IColorExtractor } from './color-extractor';

// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;

export const REGEXP_ONE = /^(?:((?:(?:\$|@)(?:\w|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;

class VariablesExtractor implements IColorExtractor {

  // public variablesDeclarations: Set<string> = new Set(); // use a map insteag (colorName: color)
  public variablesDeclarations: Map<string, Color> = new Map(); // use a map insteag (colorName: color)

  public name: string = 'VARIABLE_EXTRACTOR';

  public async extractColors(text: string): Promise<Color[]> {
    const variablesDeclarations = this.variablesDeclarations;
    let match = null;
    let colors: Color[] = [];
    while ((match = REGEXP.exec(text)) !== null) {
      // match[3] for css variables
      let varName =  match[1] || match[3];
      // match[2] for css variables
      let value =  match[1] || match[2];
      if (this.variablesDeclarations.has(varName)) {
        colors.push(new Color(value, match.index, 1, this.variablesDeclarations.get(varName).rgb));
      }
    }
    return colors;
  }

  public extractColor(text: string): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match && this.variablesDeclarations[match[0]]) {
      return new Color(match[1], match.index, 1, this.variablesDeclarations[match[0]]);
    }
    return null;
  }

  public async extractDeclarations(text: string): Promise<Map<string, Color>> {
    let match = null;
    let variablesDeclarations: Map<string, Color> = new Map();
    while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
      let color = ColorExtractor.extractOneColor(text.slice(match.index + match[0].length).trim());
      if (color) {
      // match[2] for stylus
        variablesDeclarations.set(match[1] || match[2], color);
      }
    }
    this.variablesDeclarations = variablesDeclarations;
    return variablesDeclarations;
  }
}
const instance = new VariablesExtractor();

ColorExtractor.registerExtractor(instance);
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
