import { TextEditor } from 'vscode';
import { IDecoration } from './util/color-util';

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
  public static decorate(editor: TextEditor, decorations: Map<number, IDecoration[]>, skipLines: number[]): void {
    const it = decorations.entries();
    let tmp = it.next();
    while (!tmp.done) {
      const line = tmp.value[0];
      const deco: IDecoration[] = tmp.value[1];
      if (skipLines.indexOf(line) === -1) {
        this.decorateOneLine(editor, deco, line);
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
  public static decorateOneLine(editor: TextEditor, decorations: IDecoration[], line: number): void {
    decorations.forEach((decoration: IDecoration) => {
      if (decoration.shouldGenerateDecoration() === true) {
        editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]);
      }
    });
  }
}

export default EditorManager;
