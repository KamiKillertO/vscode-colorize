import type { TextEditorDecorationType } from 'vscode';
import { Range, Position } from 'vscode';
import type { IDecoration } from '../util/color-util';
import type Variable from './variable';
import VariablesManager from './variables-manager';
import type Color from '../colors/color';

class VariableDecoration implements IDecoration {
  /**
   * The color variable used to generate the TextEditorDecorationType
   *
   * @type {Variable}
   * @public
   * @memberOf ColorDecoration
   */
  declare public variable: Variable;
  /**
   * Keep track of the TextEditorDecorationType status
   *
   * @type {boolean}
   * @public
   * @memberOf ColorDecoration
   */
  public disposed = false;

  private hidden = false;

  private decorationFn: (color: Color) => TextEditorDecorationType;

  declare public currentRange: Range;
  private _decoration?: TextEditorDecorationType;
  /**
   * The TextEditorDecorationType associated to the color
   *
   * @type {TextEditorDecorationType}
   * @memberOf ColorDecoration
   */
  get decoration() {
    this._generateDecorator();
    return this._decoration as TextEditorDecorationType;
  }
  set decoration(deco: TextEditorDecorationType) {
    this._decoration = deco;
  }

  get rgb() {
    return this.variable.color.rgb;
  }

  public constructor(
    variable: Variable,
    line: number,
    decorationFn: (color: Color) => TextEditorDecorationType,
  ) {
    this.variable = variable;
    this.decorationFn = decorationFn;
    if (this.variable.color) {
      this.generateRange(line);
    } else {
      this.currentRange = new Range(
        new Position(line, 0),
        new Position(line, 0),
      );
    }
  }
  /**
   * Disposed the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf ColorDecoration
   */
  public dispose() {
    this._decoration?.dispose();
    this.disposed = true;
  }

  public hide() {
    this._decoration?.dispose();
    this.hidden = true;
  }

  /**
   * Generate the decoration Range (start and end position in line)
   *
   * @param {number} line
   * @returns {Range}
   *
   * @memberOf ColorDecoration
   */
  public generateRange(line: number) {
    const range = new Range(
      new Position(line, this.variable.color.positionInText),
      new Position(
        line,
        this.variable.color.positionInText + this.variable.value.length,
      ),
    );
    this.currentRange = range;
    return range;
  }

  public shouldGenerateDecoration() {
    const color: Color | null = VariablesManager.findVariable(this.variable);

    if (this.disposed === true || color === null) {
      return false;
    }

    return (
      this._decoration === null || this._decoration === undefined || this.hidden
    );
  }

  private _generateDecorator() {
    const color = VariablesManager.findVariable(this.variable);
    if (color && this.variable.color !== color) {
      this.variable.color = color;
    }

    if (this.variable.color && this.variable.color.rgb) {
      this._decoration = this.decorationFn(this.variable.color);
    }
  }
}
export default VariableDecoration;
