import { Range, TextEditorDecorationType, Position } from 'vscode';
import { IDecoration } from '../util/color-util';
import Variable from './variable';
import VariablesManager from './variables-manager';
import Color from '../colors/color';

class VariableDecoration implements IDecoration {
  /**
   * The color variable used to generate the TextEditorDecorationType
   *
   * @type {Variable}
   * @public
   * @memberOf ColorDecoration
   */
  public declare variable: Variable;
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

  public declare currentRange: Range;
  private declare _decoration: TextEditorDecorationType;
  /**
   * The TextEditorDecorationType associated to the color
   *
   * @type {TextEditorDecorationType}
   * @memberOf ColorDecoration
   */
  get decoration(): TextEditorDecorationType {
    this._generateDecorator();
    return this._decoration;
  }
  set decoration(deco: TextEditorDecorationType) {
    this._decoration = deco;
  }

  get rgb(): [number, number, number] {
    return this.variable.color.rgb;
  }

  public constructor(
    variable: Variable,
    line: number,
    decorationFn: (color: Color) => TextEditorDecorationType
  ) {
    this.variable = variable;
    this.decorationFn = decorationFn;
    if (this.variable.color) {
      this.generateRange(line);
    } else {
      this.currentRange = new Range(
        new Position(line, 0),
        new Position(line, 0)
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
  public dispose(): void {
    try {
      this._decoration.dispose();
      // this.variable.color.rgb = null; // Needed ?
    } catch (error) {
      // do something
    }
    this.disposed = true;
  }
  public hide(): void {
    if (this._decoration) {
      this._decoration.dispose();
    }
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
  public generateRange(line: number): Range {
    const range = new Range(
      new Position(line, this.variable.color.positionInText),
      new Position(
        line,
        this.variable.color.positionInText + this.variable.color.value.length
      )
    );
    this.currentRange = range;
    return range;
  }

  public shouldGenerateDecoration(): boolean {
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
