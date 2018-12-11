import VariablesExtractor, { IVariableStrategy } from '../variables-extractor';
import { DocumentLine, LineExtraction, flattenLineExtractionsFlatten } from '../../util/color-util';
import Variable, { VariableLocation } from '../variable';
import Color from '../../colors/color';
import ColorExtractor from '../../colors/color-extractor';
import { EOL } from '../../util/regexp';
import BaseStrategy from './__strategy-base';

export const REGEXP = new RegExp(`(var\\((--(?:[a-z]+[\-_a-z\\d]*))\\))(?!:)${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(var\\((--(?:[a-z]+[\-_a-z\\d]*))\\))(?!:)${EOL}`, 'i');
export const DECLARATION_REGEXP = new RegExp(`(?:(--(?:[a-z]+[\\-_a-z\\d]*)\\s*):)${EOL}`, 'gi');

class CssExtractor extends BaseStrategy implements IVariableStrategy {
  public name: string = 'CSS';

  public async extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<number> {
    return fileLines.map(({text, line}) => this.__extractDeclarations(fileName, text, line)).length;
  }
  public __extractDeclarations(fileName: string, text: string, line: number) {
    let match = null;
    while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
      const varName = (match[1] || match[2]).trim();
      let color = ColorExtractor.extractOneColor(text.slice(match.index + match[0].length).trim()) || this.extractVariable(fileName, text.slice(match.index + match[0].length).trim());
      if (this.store.has(varName, fileName, line)) {
        const decoration = this.store.findDeclaration(varName, fileName, line);
        decoration.update(<Color>color);
      } else {
        const variable = new Variable(varName, <Color> color, {fileName, line, position: match.index }, this.name);
        this.store.addEntry(varName, variable); // update entry?? // outside ?
      }
    }
  }

  public extractVariables(fileName: string, fileLines: DocumentLine[]): Promise<LineExtraction[]> {
    const variables = fileLines.map(({line, text}) => {
      let match: RegExpExecArray = null;
      let colors: Variable[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        let varName =  match[2];
        varName = varName.trim();
        let value = match[1];
        let spaces = (value.match(/\s/g) || []).length;
        value = value.trim();

        const location: VariableLocation = { fileName, line, position: match.index };
        let variable = new Variable(varName, new Color(value, match.index, null, null), location, this.name);
        colors.push(variable);
      }
      return {line, colors};
    });
    return flattenLineExtractionsFlatten(variables);
  }

  extractVariable(fileName: string, text: string): Color | undefined {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    let variable;
    if (match) {
      variable = this.store.findClosestDeclaration(match[2], fileName);
    }
    return variable ? variable.color : undefined;
  }
}
VariablesExtractor.registerStrategy(new CssExtractor());
export default CssExtractor;

// ------------------------------------------------------------
// ------------------------------------------------------------
//
// THIS IS VALID
// --val: 20%, 10%, 1
// hsl(var(--val))
// hsla(var(--val), .3)
// TODO
