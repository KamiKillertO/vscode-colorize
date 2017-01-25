import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import ColorUtil from './color-util';
import Color from './color'

class ColorDecoration {
  public color: Color;
  public textPosition: Range;
  public decoration: TextEditorDecorationType;
  public disposed: boolean = false;

  public constructor(textPosition: Range, color: Color) {
    this.textPosition = textPosition;
    this.color = color;
    this._generateDecorator();
  }

  private _updateDecoration(editor) {
    this.decoration.dispose();
    this.decoration = this._generateDecorator();
    editor.setDecorations(this.decoration, [{
      range: this.textPosition
    }]);
  }
  public dispose(): void {
    this.decoration.dispose();
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
      borderColor: this.color.value,
      backgroundColor: this.color.value,
      color: textColor
    });
    this.decoration = backgroundDecorationType;
    return backgroundDecorationType;
  }
}
export default ColorDecoration;
