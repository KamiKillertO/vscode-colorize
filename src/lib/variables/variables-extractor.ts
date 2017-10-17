import Variable from './variable';
import Color from '../colors/color';
import ColorExtractor from '../colors/color-extractor';

// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:\w|-)+\s*):)|(\w(?:\w|-)*)\s*=)(?:$|"|'|,| |;|\)|\r|\n)/gi;
//  \b allow to catch stylus variables names
// export const REGEXP = /(?:((?:(?:\s|\$|@)(?:\w|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
export const REGEXP = /(?:((?:(?:@|\s|\$)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)(?!\s*(?:=|:))/gi;

export const REGEXP_ONE = /^(?:((?:(?:\$|@)(?:(?:[a-z]|\d+[a-z])[a-z\d]*|-)+))|(?:var\((--\w+(?:-|\w)*))\))(?:$|"|'|,| |;|\)|\r|\n)(?!\s*(?:=|:))/gi;

class VariablesExtractor {

  public variablesDeclarations_2: Map<string, Variable[]> = new Map(); // use a map insteag (colorName: color)

  public name: string = 'VARIABLE_EXTRACTOR';

  private _add(varName: string, variable: Variable) {
    if (this.has(varName)) {
      const decorations = this.get(varName);
      this.variablesDeclarations_2.set(varName, decorations.concat([variable]));
    } else {
      this.variablesDeclarations_2.set(varName, [variable]);
    }
    return;
  }

  public has(variable: string = null, fileName: string = null, line: number = null) {
    const declarations = this.get(variable, fileName, line);
    return declarations && declarations.length > 0;
  }

  public get(variable: string, fileName: string  = null, line: number = null): Variable[] {
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

  public delete(variable: string, fileName: string, line: number) {
    let decorations = this.get(variable);
    if (decorations === undefined) {
      return;
    }
    if (fileName === null) {
      decorations.forEach(_ => _.dispose());
      this.variablesDeclarations_2.delete(variable);
      return;
    }
    if (line !== null) {
      decorations.filter(_ => _.declaration.fileName === fileName && _.declaration.line === line).forEach(_ => _.dispose());
      decorations = decorations.filter(_ => _.declaration.fileName !== fileName || (_.declaration.fileName === fileName && _.declaration.line !== line));
    } else {
      decorations.filter(_ => _.declaration.fileName === fileName).forEach(_ => _.dispose());
      decorations = decorations.filter(_ => _.declaration.fileName !== fileName);
    }
    if (decorations.length === 0) {
      this.variablesDeclarations_2.delete(variable);
      return;
    }
    this.variablesDeclarations_2.set(variable, decorations);
    return;
  }

  public deleteVariableInLine(fileName: string, line: number) {
    const IT: IterableIterator<[string, Variable[]]> = this.variablesDeclarations_2.entries();
    let tmp: IteratorResult<[string, Variable[]]> = IT.next();
    while (tmp.done === false) {
      const varName: string = tmp.value[0];
      this.delete(varName, fileName, line);
      tmp = IT.next();
    }
  }

  public async extractVariables(text: string, fileName: string): Promise<Variable[]> {
    let match = null;
    let colors: Variable[] = [];
    while ((match = REGEXP.exec(text)) !== null) {
      // match[3] for css variables
      let varName =  match[1] || match[3];
      varName = varName.trim();
      // match[2] for css variables
      let value =  match[1] || match[2];
      let spaces = (value.match(/\s/g) || []).length;
      value = value.trim();
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
        continue;
      }
      let deco = Object.create(decorations[decorations.length - 1]);
      deco.color = new Color(value, match.index + spaces, deco.color.alpha, deco.color.rgb);
      colors.push(deco);
    }
    return colors;
  }
  // Need to be updated
  public extractOneColor(text: string, fileName, line): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match && this.has(match[0])) {
      // // match[2] for css variables
      let varName =  match[0] || match[1];
      let variables: Variable[] = [].concat(this.get(varName, fileName, line));
      if (variables.length === 0) {
        variables = [].concat(this.get(varName));
      }
      return new Color(varName, match.index, 1, variables.pop().color.rgb);
    }
    return null;
  }

  public async extractDeclarations(fileName: string, text: string, line: number): Promise<Map<string, Variable[]>> {
    let match = null;
    while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
      const varName = (match[1] || match[2]).trim();
      let color = ColorExtractor.extractOneColor(text.slice(match.index + match[0].length).trim()) || this.extractOneColor(text.slice(match.index + match[0].length).trim(), fileName, line);
      if (this.has(varName, fileName, line)) {
        const decoration = this.get(varName, fileName, line);
        if (color === undefined) {
          this.delete(varName, fileName, line);
        } else {
          decoration[0].update(<Color>color);
        }
        continue;
      }
      if (color === undefined || color === null) {
        continue;
      }
      const variable = new Variable(varName, <Color> color, {fileName, line});
      this._add(varName, variable);
    }
    return this.variablesDeclarations_2;
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
