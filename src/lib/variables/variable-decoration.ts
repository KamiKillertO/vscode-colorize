import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import ColorUtil from '../color-util';
import Color from '../colors/color';
import Variable from './variable';

interface Observer {
  update(args: any);
}

class VariableDecoration implements Observer {
  private _updateCallback: Function;
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

  public deleted: boolean = false;

  public currentRange: Range;
  private _decoration: TextEditorDecorationType;
  /**
   * The TextEditorDecorationType associated to the color
   *
   * @type {TextEditorDecorationType}
   * @memberOf ColorDecoration
   */
  get decoration(): TextEditorDecorationType {
    if (this.disposed) {
      this.disposed = false;
      this._generateDecorator();
    }
    return this._decoration;
  }
  set decoration(deco: TextEditorDecorationType) {
    this._decoration = deco;
  }
  public constructor(variable: Variable) {
    this.variable = variable;
    this._generateDecorator();
  }
  /**
   * Disposed the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf ColorDecoration
   */
  public dispose(): void {
    // this.color = null;
    this.decoration.dispose();
    this.disposed = true;
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
    let textColor = null;
    let luminance = ColorUtil.luminance(this.variable.color);
    if (luminance < 0.7) {
      textColor = '#fff';
    } else {
      textColor = '#000';
    }
    let backgroundDecorationType = window.createTextEditorDecorationType({
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: this.variable.color.toRgbString(),
      backgroundColor: this.variable.color.toRgbString(),
      color: textColor
    });
    this.decoration = backgroundDecorationType;
  }
  addUpdateCallback(callback) {
    this._updateCallback = callback;
  }
  updateDecoration(color: Color) {
    this.deleted = false;
    this._decoration.dispose();
    this.variable.color.rgb = color.rgb;
    this._generateDecorator();
    return this._updateCallback(this);
  }
  disposeDecoration() {
    this.dispose();
    this.deleted = true;
  }
  update(args: Object[]) {
    const action = args[0];
    this[`${action}Decoration`](...args.slice(1));
  }
}
export default VariableDecoration;
