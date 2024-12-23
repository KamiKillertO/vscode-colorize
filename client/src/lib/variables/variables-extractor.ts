import type Color from '../colors/color';
import type { DocumentLine, LineExtraction } from '../util/color-util';
import { flattenLineExtractionsFlatten } from '../util/color-util';
import type { IStrategy } from '../extractor-mixin';
import { Extractor } from '../extractor-mixin';
import type Variable from './variable';

// export class IVariableStrategy { // class instead? // avoid duplication (variablesCount/deleteVariable same code for all extractors)
export interface IVariableStrategy extends IStrategy {
  extractDeclarations(
    fileName: string,
    fileLines: DocumentLine[],
  ): Promise<number>;

  extractVariables(
    fileName: string,
    fileLines: DocumentLine[],
  ): LineExtraction[];
  extractVariable(fileName: string, text: string): Color;
  getVariableValue(variable: Variable): Color | null;
  deleteVariable(fileName: string, line?: number): void;
  variablesCount(): number;
}

class VariablesExtractor extends Extractor {
  public async extractVariables(fileName: string, fileLines: DocumentLine[]) {
    const colors = await Promise.all(
      this.enabledStrategies.map((strategy) =>
        (<IVariableStrategy>strategy).extractVariables(fileName, fileLines),
      ),
    );
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }

  public deleteVariableInLine(fileName: string, line: number) {
    this.enabledStrategies.forEach((strategy) =>
      (<IVariableStrategy>strategy).deleteVariable(fileName, line),
    );
  }

  public async extractDeclarations(
    fileName: string,
    fileLines: DocumentLine[],
  ) {
    return Promise.all(
      this.enabledStrategies.map((strategy) =>
        (<IVariableStrategy>strategy).extractDeclarations(fileName, fileLines),
      ),
    );
  }

  public getVariablesCount() {
    return this.enabledStrategies.reduce(
      (cv, strategy) => cv + (<IVariableStrategy>strategy).variablesCount(),
      0,
    );
  }

  public findVariable(variable: Variable) {
    return (<IVariableStrategy>this.get(variable.type)).getVariableValue(
      variable,
    );
  }

  public removeVariablesDeclarations(fileName: string) {
    this.enabledStrategies.forEach((strategy) =>
      (<IVariableStrategy>strategy).deleteVariable(fileName),
    );
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
