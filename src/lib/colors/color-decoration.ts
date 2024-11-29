import type { TextEditorDecorationType } from 'vscode';
import { Range, Position } from 'vscode';

import type { IDecoration } from '../util/color-util';
import type Color from './color';

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
  public disposed = false;
  public hidden = false;

  private decorationFn: (color: Color) => TextEditorDecorationType;

  declare public currentRange: Range;
  declare private _decoration: TextEditorDecorationType;
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

  public constructor(
    color: Color,
    line: number,
    decorationFn: (color: Color) => TextEditorDecorationType,
  ) {
    this.color = color;
    this.decorationFn = decorationFn;
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
    } catch (error) {
      // do something
      console.log(error);
    }
  }
  /**
   * Hide the TextEditorDecorationType.
   *
   * @public
   * @memberOf ColorDecoration
   */
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
      new Position(line, this.color.positionInText),
      new Position(line, this.color.positionInText + this.color.value.length),
    );
    this.currentRange = range;
    return range;
  }

  public shouldGenerateDecoration(): boolean {
    if (this.disposed === true /* || this.hidden === true */) {
      return false;
    }

    return (
      this._decoration === null || this._decoration === undefined || this.hidden
    );
  }

  private _generateDecorator() {
    this._decoration = this.decorationFn(this.color);
  }
}
export default ColorDecoration;
