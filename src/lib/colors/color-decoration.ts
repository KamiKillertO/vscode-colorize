import {
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import { generateOptimalTextColor } from '../util/color-util';
import Color from './color';


class ColorDecoration {
  /**
   * The color used to generate the TextEditorDecorationType
   *
   * @type {Color}
   * @public
   * @memberOf ColorDecoration
   */
  public color: Color;
  /**
   * Keep track of the TextEditorDecorationType status
   *
   * @type {boolean}
   * @public
   * @memberOf ColorDecoration
   */
  public disposed: boolean = false;
  public hidden: boolean = false;

  private _decoration: TextEditorDecorationType;
  /**
   * The TextEditorDecorationType associated to the color
   *
   * @type {TextEditorDecorationType}
   * @memberOf ColorDecoration
   */
  get decoration(): TextEditorDecorationType {
    if (this.hidden) {
      this.hidden = false;
      this._generateDecorator();
    }
    return this._decoration;
  }
  set decoration(deco: TextEditorDecorationType) {
    this._decoration = deco;
  }
  public constructor(color: Color) {
    this.color = color;
    this._generateDecorator();
  }
  /**
   * Dispose the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf ColorDecoration
   */
  public dispose(): void {
    this._decoration.dispose();
    this.disposed = true;
  }
  /**
   * Hide the TextEditorDecorationType.
   *
   * @public
   * @memberOf ColorDecoration
   */
  public hide() {
    this._decoration.dispose();
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
    return new Range(new Position(line, this.color.positionInText), new Position(line, this.color.positionInText + this.color.value.length));
  }

  private _generateDecorator() {
    let backgroundDecorationType = window.createTextEditorDecorationType({
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: this.color.toRgbString(),
      backgroundColor: this.color.toRgbString(),
      color: generateOptimalTextColor(this.color)
    });
    this._decoration = backgroundDecorationType;
  }
}
export default ColorDecoration;
