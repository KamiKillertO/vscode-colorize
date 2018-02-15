import Variable from './variable';
import Color from '../colors/color';
import ColorExtractor from '../colors/color-extractor';
import { dirname } from 'path';
import { DocumentLine, LineExtraction, flattenLineExtractionsFlatten } from '../color-util';


export interface IVariableExtractor {
  name: string;
  extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<void>;
  extractVariables(fileName: string, fileLines: DocumentLine[]): Promise <LineExtraction[]>;
  extractVariable(fileName: string, text: string): Color;
  variablesCount(): number;
}
// stylus no prefix needed and = instead of :
export const DECLARATION_REGEXP = /(?:(?:((?:\$|@|--)(?:[a-z]+[\-_a-z\d]*)\s*):)|(\w(?:\w|-)*)\s*=)(?:$|"|'|,| |;|\)|\r|\n)/gi;

export const REGEXP = /(?:((?:(?:@|\s|\$)(?:[a-z]+[\-_a-z\d]*)+))|(var\((--\w+(?:-|\w)*)\)))(?:$|"|'|,| |;|\)|\r|\n)(?!\s*(?:=|:))/gi;

const CSS_VARIABLES_BASE = '(var\\((--\\w+(?:-|\\w)*)\\))(?!:)(?:$|\"|\'|,| |;|\\)|\\r|\\n)';
const SASS_LESS_VARIABLES_BASE = '((?:@|\\$)(?:[a-z]+[\\-_a-z\\d]*)(?!:))(?:$|\\"|\'|,| |;|\\)|\\r|\\n)';
const STYLUS_VARIABLES_BASE = '(^|(?::|=)\\s*)((?:-|_)*[$a-z]+[\\-_\\d]*)+(?!=)(?:$|\"|\'|,| |;|\\)|\\r|\\n)';

export const CSS_VARIABLES = new RegExp(CSS_VARIABLES_BASE, 'gi');
export const SASS_LESS_VARIABLES = new RegExp(SASS_LESS_VARIABLES_BASE, 'gi');
export const STYLUS_VARIABLES = new RegExp(STYLUS_VARIABLES_BASE, 'gi');

export const ONE_CSS_VARIABLES = new RegExp(`^${CSS_VARIABLES_BASE}`, 'i');
export const ONE_SASS_LESS_VARIABLES = new RegExp(`^${SASS_LESS_VARIABLES_BASE}`, 'i');
export const ONE_STYLUS_VARIABLES = new RegExp(`^${STYLUS_VARIABLES_BASE}`, 'i');

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

  public findClosestDeclaration(variable, file) {
    let decorations = this.get(variable, file);
    decorations = decorations.sort((a, b) => a.declaration.line - b.declaration.line);
    if (decorations.length !== 0) {
      return decorations;
    }
    decorations = this.get(variable);
    if (decorations.length === 0) {
      return;
    }
    decorations = this.filterDecorations(decorations, file);
    decorations = decorations.sort((a, b) => a.declaration.line - b.declaration.line);
    return decorations;
    // here should check all declaration file to find the closest (parent folder)
  }
  private filterDecorations(decorations, file) {
    file = dirname(file);
    let r = new RegExp(`^${encodeURI(file)}`);
    let decorationsFound = decorations.filter((deco: Variable) => r.test(encodeURI(deco.declaration.fileName)));
    if (decorationsFound.length !== 0) {
      return decorationsFound;
    }
    return this.filterDecorations(decorations, file);
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

  public async extractVariables(fileName: string, fileLines: DocumentLine[]): Promise<LineExtraction[]> {

    const variables = fileLines.map(({line, text}) => {
      return {
        line,
        colors: this.__extractVariables(text, fileName)
      };
    });
    return flattenLineExtractionsFlatten(variables);
  }
  public __extractVariables(text: string, fileName: string): Variable[] {
    let match = null;
    let colors: Variable[] = [];
    while ((match = CSS_VARIABLES.exec(text)) !== null) {
      let varName =  match[2];
      varName = varName.trim();
      let value = match[1];
      let spaces = (value.match(/\s/g) || []).length;
      value = value.trim();
      if (!this.has(varName)) {
        continue;
      }
      let decorations = this.findClosestDeclaration(varName, fileName);
      if (decorations.length === 0) {
        this.variablesDeclarations_2.delete(varName);
        continue;
      }
      let deco = Object.create(decorations.pop());
      deco.color = new Color(value, match.index + spaces, deco.color.alpha, deco.color.rgb);
      colors.push(deco);
    }
    while ((match = SASS_LESS_VARIABLES.exec(text)) !== null) {
      let varName =  match[1];
      varName = varName.trim();
      if (!this.has(varName)) {
        continue;
      }
      let decorations = this.findClosestDeclaration(varName, fileName);
      if (decorations.length === 0) {
        this.variablesDeclarations_2.delete(varName);
        continue;
      }
      let deco = Object.create(decorations.pop());
      deco.color = new Color(varName, match.index, deco.color.alpha, deco.color.rgb);
      colors.push(deco);
    }
    while ((match = STYLUS_VARIABLES.exec(text)) !== null) {
      let varName =  match[2];
      varName = varName.trim();
      let spaces = (match[1] || '').length;
      if (!this.has(varName)) {
        continue;
      }
      let decorations = this.findClosestDeclaration(varName, fileName);
      if (decorations.length === 0) {
        this.variablesDeclarations_2.delete(varName);
        continue;
      }
      let deco = Object.create(decorations.pop());
      deco.color = new Color(varName, match.index + spaces, deco.color.alpha, deco.color.rgb);
      colors.push(deco);
    }
    return colors;
  }
  // Need to be updated
  public extractOneColor(text: string, fileName, line): Color {
    // need to select the regexp
    let match: RegExpExecArray = ONE_SASS_LESS_VARIABLES.exec(text) || ONE_CSS_VARIABLES.exec(text) || ONE_STYLUS_VARIABLES.exec(text);
    ONE_SASS_LESS_VARIABLES.exec(text) || ONE_CSS_VARIABLES.exec(text) || ONE_STYLUS_VARIABLES.exec(text); // prevent null return for later calls

    if (match && (this.has(match[0]) || this.has(match[2]))) {
      // // match[2] for css variables
      let varName =  match[2] || match[1];
      let variables: Variable[] = [].concat(this.get(varName, fileName, line));
      if (variables.length === 0) {
        variables = [].concat(this.get(varName));
      }
      return new Color(varName, match.index, 1, variables.pop().color.rgb);
    }
    return null;
  }
  public async extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<Map<string, Variable[]>> {
    return fileLines.map(({text, line}) => this.__extractDeclarations(fileName, text, line)).pop();
  }
  public __extractDeclarations(fileName: string, text: string, line: number): Map<string, Variable[]> {
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

// stylus
//
// valid
//
// var= #111;
// --a= #fff
// -a=#fff
// _a= #fff
// $a= #fff
//
// not valid
//
// 1a= #fff


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
