import VariablesExtractor, { IVariableStrategy } from '../variables-extractor';
import { DocumentLine, LineExtraction, flattenLineExtractionsFlatten } from '../../color-util';
import Variable from '../variable';
import Color, { IColor } from '../../colors/color';
import VariablesStore from '../variable-store';
import ColorExtractor from '../../colors/color-extractor';

const REGEXP_END = '(?:$|\"|\'|,| |;|\\)|\\r|\\n)';

export const REGEXP = new RegExp(`(\\$(?:[a-z]+[\\-_a-z\\d]*)(?!:))${REGEXP_END}`, 'gi');
export const REGEXP_ONE = new RegExp(`^(\\$(?:[a-z]+[\\-_a-z\\d]*)(?!:))${REGEXP_END}`, 'i');
export const DECLARATION_REGEXP = new RegExp(`(?:(\\$(?:[a-z]+[\\-_a-z\\d]*)\\s*):)${REGEXP_END}`, 'gi');

class SassExtractor implements IVariableStrategy {
  name: string = 'SASS_EXTRACTOR';
  private store: VariablesStore = new VariablesStore();

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
        const variable = new Variable(varName, <Color> color, {fileName, line});
        this.store.addEntry(varName, variable); // update entry??
      }
    }
  }
  extractVariables(fileName: string, fileLines: DocumentLine[]): Promise<LineExtraction[]> {
    const variables = fileLines.map(({line, text}) => {
      let match = null;
      let colors: Variable[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        let varName =  match[1];
        varName = varName.trim();
        if (this.store.has(varName)) {
          let decoration = this.store.findClosestDeclaration(varName, fileName);
          let variable;
          // const declaration = { fileName, line }; //or null
          const declaration = null;
          if (decoration.color) {
            variable = new Variable(varName, new Color(varName, match.index, decoration.color.rgb, decoration.color.alpha), declaration);
          } else {
            variable = new Variable(varName, new Color(varName, match.index, null), declaration);
          }
          variable.base = decoration; // TODO: This is temp, I need to rethink the variables declaration/usage thing
          colors.push(variable);
        }
      }
      return {line, colors};
    });
    return flattenLineExtractionsFlatten(variables);
  }
  extractVariable(fileName: string, text: string): Color | undefined {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    let variable;
    if (match) {
      variable = this.store.findClosestDeclaration(match[1], fileName);
    }
    return variable ? variable.color : undefined;
  }
  variablesCount() {
    return this.store.count;
  }
  deleteVariable(fileName: string, line: number) {
    return this.store.delete(null, fileName, line);
  }
}

VariablesExtractor.registerStrategy(new SassExtractor());
export default SassExtractor;
