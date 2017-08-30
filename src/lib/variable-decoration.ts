import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import ColorUtil from './color-util';
import Color from './color';
import Variable from './variable';
import ColorDecoration from './color-decoration';

class VariableDecoration extends ColorDecoration {
  public constructor(variable: Variable) {
    super(variable.color);
  }
}
export default VariableDecoration;
