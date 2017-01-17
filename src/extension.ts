'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  window,
  workspace,
  ExtensionContext,
  OverviewRulerLane,
  TextEditor,
  DecorationOptions,
  Range,
  TextEditorDecorationType,
  TextDocument,
  TextLine,
  Position
} from 'vscode';

import { HEXA_COLOR } from './color-regex';
import ColorUtil from './color-util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let decorations: ColorDecoration[] = [];

export function activate(context: ExtensionContext) {
  let timeout = null;
  let editor = window.activeTextEditor;

  function triggerUpdateDecorations( /*range*/ ) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(updateDecorations, 500);
  }

  function updateDecorations( /*editor: TextEditor, editedRange: Range*/ ) {
    if (!editor) {
      return;
    }


    let disposed = decorations.filter(decoration => {
      decoration.checkDecoration(editor);
      return decoration.disposed;
    });

    let text = window.activeTextEditor.document.getText();
    let match = null;
    let start = 0;
    while (match = HEXA_COLOR.exec(text)) {
      let startPos = editor.document.positionAt(start + match.index);
      let endPos = editor.document.positionAt(start + match.index + match[1].length);
      start += match.index + match[1].length;
      text = text.substr(match.index + match[1].length);
      let alreadyIn = decorations.find(decoration => decoration.textPosition.start.isEqual(startPos) && decoration.textPosition.end.isEqual(endPos));
      if (alreadyIn) {
        continue;
      }
      let range = new Range(startPos, endPos);

      let decoration = generateDecorator(match[1]);
      decorations.push(new ColorDecoration(range, decoration, HEXA_COLOR, match[1]));
      editor.setDecorations(decoration, [range]);
    }
  }

  if (editor) {
    triggerUpdateDecorations();
  }
  window.onDidChangeActiveTextEditor(newEditor => {
    editor = newEditor;
    if (editor) {
      triggerUpdateDecorations();
    }
  }, null, context.subscriptions);

  workspace.onDidChangeTextDocument(event => {
    if (editor && event.document === editor.document) {
      triggerUpdateDecorations( /*event.contentChanges*/ );
    }
  }, null, context.subscriptions);
}


function generateDecorator(color: string): TextEditorDecorationType {
  let textColor = null;
  let luminance = ColorUtil.luminance(color);
  if (luminance < 0.7) {
    textColor = '#fff';
  } else {
    textColor = '#000';
  }
  let backgroundDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color,
    backgroundColor: color,
    color: textColor
  });
  return backgroundDecorationType;
}

// this method is called when your extension is deactivated
export function deactivate() {}


class ColorDecoration {
  public textPosition: Range;
  private _decoration: TextEditorDecorationType;
  private _matcher: RegExp;
  private _match: string;
  public disposed: boolean = false;

  public constructor(textPosition: Range, decoration: TextEditorDecorationType, matcher: RegExp, match: string) {
    this.textPosition = textPosition;
    this._decoration = decoration;
    this._matcher = matcher;
    this._match = match;
  }
  public checkDecoration(editor: TextEditor): void {
    let character_after = editor.document.lineAt(this.textPosition.start.line).text.substring(this.textPosition.end.character, this.textPosition.end.character + 1);
    let text = editor.document.lineAt(this.textPosition.start.line).text.substring(this.textPosition.start.character, this.textPosition.end.character + 1);
    if (!this._matcher.test(text) || character_after === "") {
      this._decoration.dispose();
      this.disposed = true;
      return;
    }
    if (text === this._match) {
      return;
    }
    this._match = text;
    this._updateDecoration(editor);
    return;
  }

  private _updateDecoration(editor) {
    this._decoration.dispose();
    let decoration = generateDecorator(this._match);
    this._decoration = decoration;
    editor.setDecorations(this._decoration, [{
      range: this.textPosition
    }]);
  }
  public dispose(): void {
    this._decoration.dispose();
  }
}
