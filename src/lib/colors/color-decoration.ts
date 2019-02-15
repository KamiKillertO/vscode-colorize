import {
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import { generateOptimalTextColor, IDecoration } from '../util/color-util';
import Color from './color';

class ColorDecoration implements IDecoration {
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

  public currentRange: Range;
  private _decoration: TextEditorDecorationType;
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

  get rgb() {
    return this.color.rgb;
  }

  public constructor(color: Color, line: number) {
    this.color = color;
    this.generateRange(line);
  }
  /**
   * Dispose the TextEditorDecorationType
   * (destroy the colored background)
   *
   * @public
   * @memberOf ColorDecoration
   */
  public dispose(): void {
    try {
      this._decoration.dispose();
      this.disposed = true;
    } catch (error) {}
  }
  /**
   * Hide the TextEditorDecorationType.
   *
   * @public
   * @memberOf ColorDecoration
   */
  public hide() {
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
    const range = new Range(new Position(line, this.color.positionInText), new Position(line, this.color.positionInText + this.color.value.length));
    this.currentRange = range;
    return range;
  }

  public shouldGenerateDecoration(): boolean {
    if (this.disposed === true /* || this.hidden === true */) {
      return false;
    }

    return this._decoration === null || this._decoration === undefined || this.hidden ;
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
