import {
  TextEditor,
  Range,
  TextEditorDecorationType,
  Position,
  window
} from 'vscode';

import ColorUtil from './color-util';
import Color from './color';
import ColorDecoration from './color-decoration';

interface Observer {
  update(args: any);
}

class VariableDecoration extends ColorDecoration {
}
export default ColorDecoration;
