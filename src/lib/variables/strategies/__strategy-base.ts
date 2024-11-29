import type { VariableLocation } from '../variable';
import Variable from '../variable';
import Color from '../../colors/color';
import VariablesStore from '../variable-store';
import ColorExtractor from '../../colors/color-extractor';
import type { DocumentLine, LineExtraction } from '../../util/color-util';
import { flattenLineExtractionsFlatten } from '../../util/color-util';

export interface IStategyRegexpResultExtractor {
  getVariableNameFromDeclaration(match: RegExpExecArray): string;

  getVariableNameFromUses(
    match: RegExpExecArray,
  ): string[] | [string, string | null, string];

  getVariableNameFromUse(match: RegExpMatchArray): string;
}

export default class VariableStrategy {
  constructor(
    public name: string,
    private DECLARATION_REGEXP: RegExp,
    private USES_REGEXP: RegExp,
    private USE_REGEXP: RegExp,
    private regexpExtractor: IStategyRegexpResultExtractor,
  ) {}

  protected store: VariablesStore = new VariablesStore();

  public async extractDeclarations(
    fileName: string,
    fileLines: DocumentLine[],
  ) {
    return Promise.resolve(
      fileLines.map(({ text, line }) =>
        this.__extractDeclarations(fileName, text, line),
      ).length,
    );
  }
  public __extractDeclarations(
    fileName: string,
    text: string,
    line: number,
  ): void {
    let match = null;
    while ((match = this.DECLARATION_REGEXP.exec(text)) !== null) {
      const varName =
        this.regexpExtractor.getVariableNameFromDeclaration(match);
      const color =
        ColorExtractor.extractOneColor(
          text.slice(match.index + match[0].length).trim(),
        ) ||
        this.extractVariable(
          fileName,
          text.slice(match.index + match[0].length).trim(),
        );
      if (this.store.has(varName, fileName, line)) {
        const decoration = this.store.findDeclaration(varName, fileName, line);
        decoration.update(<Color>color);
      } else {
        const variable = new Variable(
          varName,
          varName,
          <Color>color,
          { fileName, line, position: match.index },
          this.name,
        );
        this.store.addEntry(varName, variable); // update entry?? // outside ?
      }
    }
  }

  public extractVariables(
    fileName: string,
    fileLines: DocumentLine[],
  ): LineExtraction[] {
    const variables = fileLines.map(({ line, text }) => {
      let match: RegExpExecArray | null = null;
      const colors: Variable[] = [];

      while ((match = this.USES_REGEXP.exec(text)) !== null) {
        const [varName, extendedVarName, spaces] =
          this.regexpExtractor.getVariableNameFromUses(match);

        const spacesCount = (spaces || '').length;

        const location: VariableLocation = {
          fileName,
          line,
          position: spacesCount + match.index,
        };
        const variable = new Variable(
          varName,
          extendedVarName || varName,
          new Color(
            extendedVarName || varName,
            spacesCount + match.index,
            // @ts-expect-error Works for now, need to clean this
            null,
            null,
          ),
          location,
          this.name,
        );
        colors.push(variable);
      }
      return { line, colors };
    });

    return flattenLineExtractionsFlatten(variables);
  }

  extractVariable(fileName: string, text: string): Color | undefined {
    const match = text.match(this.USE_REGEXP);
    let variable;
    if (match) {
      const varName = this.regexpExtractor.getVariableNameFromUse(match);
      variable = this.store.findClosestDeclaration(varName, fileName);
      // variable = this.store.findClosestDeclaration(match[2], fileName);
      return variable ? variable.color : undefined;
    }
  }

  /**
   * Return the value (color) of a variable.
   * The value is determined by searching the nearest variable declaration
   * @param {Variable} variable
   * @returns {Color|null}
   */
  public getVariableValue(variable: Variable): Color | null {
    let color = null;
    if (this.store.has(variable.name) === true) {
      let declaration = this.store.findClosestDeclaration(
        variable.name,
        variable.location.fileName,
      );
      if (declaration.color === undefined) {
        declaration = this.store.findClosestDeclaration(variable.name, '.');
      }

      if (declaration.color) {
        color = new Color(
          declaration.color.alpha === -1
            ? declaration.color.value
            : variable.color.value,
          variable.location.position,
          declaration.color.rgb,
          declaration.color.alpha,
        );
      }
    }
    return color;
  }

  variablesCount(): number {
    return this.store.count;
  }

  deleteVariable(fileName: string, line: number): void {
    this.store.deleteVariablesFile(fileName, line);
  }
}

// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;

// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//   };
// }
