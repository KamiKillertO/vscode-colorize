import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';
import { generateOptimalTextColor } from '../color-util';
import Color from '../colors/color';
import Variable from './variable';

class VariableDecoration {
  /**
   * The color variable used to generate the TextEditorDecorationType
   *
   * @type {Variable}
   * @public
   * @memberOf ColorDecoration
   */
  public variable: Variable;
  /**
   * Keep track of the TextEditorDecorationType status
   *
   * @type {boolean}
   * @public
   * @memberOf ColorDecoration
   */
  public disposed: boolean = false;

  private hidden: boolean = false;

  public currentRange: Range;
  private _decoration: TextEditorDecorationType;
  /**
   * The TextEditorDecorationType associated to the color
   *
   * @type {TextEditorDecorationType}
   * @memberOf ColorDecoration
   */
  get decoration(): TextEditorDecorationType {
    if (this.hidden || this._decoration === undefined) {
      this.hidden = false;
      this._generateDecorator();
    }
    return this._decoration;
  }
  set decoration(deco: TextEditorDecorationType) {
    this._decoration = deco;
  }
  public constructor(variable: Variable, line: number) {
    this.variable = variable;
    this._generateDecorator();
    if (this.variable.color) {
      this.generateRange(line);
    } else {
      this.currentRange = new Range(new Position(line, 0), new Position(line, 0));
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
      this.variable.color.rgb = null;
    } catch (error) {}
    this.disposed = true;
  }
  public hide(): void {
    // this.color = null;
    try {
      this._decoration.dispose();
    } catch (error) {}
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
    const range = new Range(new Position(line, this.variable.color.positionInText), new Position(line, this.variable.color.positionInText + this.variable.color.value.length));
    this.currentRange = range;
    return range;
  }

  private _generateDecorator() {
    if (this.variable.color.rgb) {
      let backgroundDecorationType = window.createTextEditorDecorationType({
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: this.variable.color.toRgbString(),
        backgroundColor: this.variable.color.toRgbString(),
        color: generateOptimalTextColor(this.variable.color)
      });
      this._decoration = backgroundDecorationType;
    }
  }
}
export default VariableDecoration;
