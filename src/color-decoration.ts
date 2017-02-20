import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import ColorUtil from './color-util';
import Color from './color';

class ColorDecoration {
  public color: Color;
  public decoration: TextEditorDecorationType;
  public disposed: boolean = false;

  public constructor(color: Color) {
    this.color = color;
    this._generateDecorator();
  }

  public dispose(): void {
    this.color = null;
    this.decoration.dispose();
  }

  public generateRange(line: number) {
    return new Range(new Position(line, this.color.positionInText), new Position(line, this.color.positionInText + this.color.value.length));
  }

  private _generateDecorator(): TextEditorDecorationType {
    let textColor = null;
    let luminance = ColorUtil.luminance(this.color);
    if (luminance < 0.7) {
      textColor = '#fff';
    } else {
      textColor = '#000';
    }
    let backgroundDecorationType = window.createTextEditorDecorationType({
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: this.color.toRGBString(),
      backgroundColor: this.color.toRGBString(),
      color: textColor
    });
    this.decoration = backgroundDecorationType;
    return backgroundDecorationType;
  }
}
export default ColorDecoration;
