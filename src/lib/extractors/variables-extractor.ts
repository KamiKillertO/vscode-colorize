import Color, {IColor} from './../color';
import Variable from './../variable';
import ColorExtractor, { IColorExtractor } from './color-extractor';

// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
// export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
export const REGEXP = /(?:((?:(?:\s|\$|@)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;

export const REGEXP_ONE = /^(?:((?:(?:\$|@)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)/gi;

class VariablesExtractor implements IColorExtractor {

  public variablesDeclarations_2: Map<string, Variable[]> = new Map(); // use a map insteag (colorName: color)

  public name: string = 'VARIABLE_EXTRACTOR';

  public has(variable: string = null, fileName: string = null, line: number = null) {
    const declarations = this.get(variable, fileName, line);
    return declarations && declarations.length > 0;
  }

  public get(variable: string, fileName: string  = null, line: number = null): Variable[] {
    let decorations = this.variablesDeclarations_2.get(variable);
    if (fileName !== null) {
      decorations = decorations.filter(_ => _.declaration.fileName === fileName);
      if (line !== null) {
        decorations = decorations.filter(_ => _.declaration.line === line);
      }
    }
    return decorations;
  }

  public async extractColors(text: string, fileName: string): Promise<IColor[]> {
    let match = null;
    let colors: IColor[] = [];
    while ((match = REGEXP.exec(text)) !== null) {
      // match[3] for css variables
      let varName =  match[1] || match[3];
      // match[2] for css variables
      let value =  match[1] || match[2];
      if (this.has(varName)) {

        let decorations = this.get(varName, fileName);
        decorations = decorations.sort((a, b) => a.declaration.line - b.declaration.line);
        if (decorations.length === 0) {
          decorations = this.get(varName);
        }
        if (decorations.length === 0) {
          this.variablesDeclarations_2.delete(varName);
        }
        let deco = decorations[decorations.length - 1];
        // reference error >< multiple instance
        colors.push(new Color(varName, match.index, deco.color.alpha, deco.color.rgb));
      }
    }
    return colors;
  }
  // Need to be updated
  public extractColor(text: string): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match && this.has(match[0])) {
      const variable = [].concat(this.get(match[0]));
      return new Color(match[0], match.index, 1, variable.pop().color.rgb);
    }
    return null;
  }

  public async extractDeclarations(fileName: string, text: string, line: number): Promise<Map<string, Variable[]>> {
    let match = null;
    while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
      let color = ColorExtractor.extractOneColor(text.slice(match.index + match[0].length).trim());
      if (color) {
        const varName = match[1] || match[2];
        const variable = new Variable(varName, <Color> color, {fileName, line});
        if (this.has(varName)) {
          const decorations = this.get(varName);
          this.variablesDeclarations_2.set(varName, decorations.concat([variable]));
        } else {
          this.variablesDeclarations_2.set(varName, [variable]);
        }
      }
    }
    return this.variablesDeclarations_2;
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
