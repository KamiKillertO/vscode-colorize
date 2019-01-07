import Variable from '../variable';
import Color from '../../colors/color';
import VariablesStore from '../variable-store';

export default class BaseStrategy {

  protected store: VariablesStore = new VariablesStore();
  /**
   * Return the value (color) of a variable.
   * The value is determined by searching the nearest variable declaration
   * @param {Variable} variable
   * @returns {Color|null}
   */
  public getVariableValue(variable: Variable): Color | null {
    let color = null;
    if (this.store.has(variable.name) === true) {
      let declaration = this.store.findClosestDeclaration(variable.name, variable.location.fileName);
      if (declaration.color === undefined) {
        declaration = this.store.findClosestDeclaration(variable.name, '.');
      }

      if (declaration.color) {
        color = new Color(variable.color.value, variable.location.position, declaration.color.rgb, declaration.color.alpha);
      }
    }
    return color;
  }

  variablesCount(): number {
    return this.store.count;
  }

  deleteVariable(fileName: string, line: number) {
    return this.store.delete(null, fileName, line);
  }
}

// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;

// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//   };
// }
