import Variable from './variable';
import Color, { IColor } from '../colors/color';
import ColorExtractor from '../colors/color-extractor';
import { dirname } from 'path';
import { DocumentLine, LineExtraction, flattenLineExtractionsFlatten } from '../color-util';


export interface IVariableExtractor {
  name: string;
  extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<number>;
  extractVariables(fileName: string, fileLines: DocumentLine[]): Promise <LineExtraction[]>;
  extractVariable(fileName: string, text: string): Color;
  variablesCount(): number;
}

// stylus no prefix needed and = instead of :
class VariablesExtractor {

  public extractors: IVariableExtractor[];
  constructor() {
    this.extractors = [];
  }
  public registerExtractor(extractor: IVariableExtractor) {
    if (!this.has(extractor)) {
      this.extractors.push(extractor);
    }
  }
  public has(extractor: string | IVariableExtractor): boolean {
    if (typeof extractor === 'string') {
      return this.extractors.some(_ => _.name === extractor);
    }
    return this.extractors.some(_ => _.name === extractor.name);
  }

  public get(extractor: string | IVariableExtractor): IVariableExtractor {
    if (this.has(extractor) === false) {
      return null;
    }
    return this.extractors.find(_ => _.name === extractor);
  }
  public async extractVariables(fileName: string, fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    const colors = await Promise.all(this.extractors.map(extractor => extractor.extractVariables(fileName, fileLines)));
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }

  public deleteVariableInLine(fileName: string, line: number) {
    // const IT: IterableIterator<[string, Variable[]]> = this.variablesDeclarations_2.entries();
    // let tmp: IteratorResult<[string, Variable[]]> = IT.next();
    // while (tmp.done === false) {
    //   const varName: string = tmp.value[0];
    //   this.delete(varName, fileName, line);
    //   tmp = IT.next();
    // }
  }
  public async extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<number[]> {
    return Promise.all(this.extractors.map(extractor => extractor.extractDeclarations(fileName, fileLines)));
  }
  public getVariablesCount(): number {
    return this.extractors.reduce((cv, extractor) => cv + extractor.variablesCount(), 0);
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
