import { TextEditor } from 'vscode';
import { IDecoration } from './color-util';
import VariableDecoration from './variables/variable-decoration';

class EditorManager {

  /**
   * Run through a list of decorations to generate editor's decorations
   *
   * @static
   * @param {TextEditor} editor
   * @param {Map<number, IDecoration[]>} decorations
   * @param {number[]} skipLines
   * @returns
   * @memberof EditorManager
   */
  public static decorate(editor: TextEditor, decorations: Map<number, IDecoration[]>, skipLines: number[]) {
    let it = decorations.entries();
    let tmp = it.next();
    while (!tmp.done) {
      const line = tmp.value[0];
      const deco: IDecoration[] = tmp.value[1];
      if (skipLines.indexOf(line) === -1) {
        this.decorateOneLine(editor, tmp.value[1], line);
      }
      tmp = it.next();
    }
    return;
  }

  // Decorate editor's decorations for one line
  /**
   * Generate decorations in one line for the selected editor
   *
   * @static
   * @param {TextEditor} editor
   * @param {IDecoration[]} decorations
   * @param {number} line
   * @memberof EditorManager
   */
  public static decorateOneLine(editor: TextEditor, decorations: IDecoration[], line: number) {
    decorations.forEach((decoration: IDecoration) => {
      if (!(<VariableDecoration>decoration).disposed) {
        editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]);
      }
    });
  }
}

export default  EditorManager;
