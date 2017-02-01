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
  Position,
  TextDocumentChangeEvent,
  TextDocumentContentChangeEvent
} from 'vscode';

import {
  HEXA_COLOR
} from './color-regex';
import ColorUtil from './color-util';
import ColorDecoration from './color-decoration';
import Color from './color';
import Queue from './queue';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function mapKeysToArray(map: Map < number, any > ) {
  let it = map.keys();
  let tmp = it.next();
  let array = [];
  while (!tmp.done) {
    array.push(tmp.value);
    tmp = it.next();
  }
  return array;
};

function generateTextDocumentContentChange(line: number, text: string): TextDocumentContentChangeEvent {
  return {
    rangeLength: 0,
    text: text,
    range: new Range(new Position(line, 0), new Position(line, 0))
  };
}

function mutEditedLIneForDeletion(editedLine: TextDocumentContentChangeEvent[]): TextDocumentContentChangeEvent[] {
  let newEditedLine: TextDocumentContentChangeEvent[] = [];
  let startLine = 0;
  let before = 0;
  editedLine.reverse();
  editedLine.forEach(line => {
    startLine = line.range.start.line + before;
    for (let i = line.range.start.line; i <= line.range.end.line; i++) {
      newEditedLine.push(generateTextDocumentContentChange(i, line.text));
      before--;
    }
    before++;
  });
  return newEditedLine.reverse();
}

function mutEditedLIne(editedLine: TextDocumentContentChangeEvent[]): TextDocumentContentChangeEvent[] {
  let newEditedLine: TextDocumentContentChangeEvent[] = [];
  let startLine = 0;
  let before = 0;
  editedLine.reverse();
  editedLine.forEach(line => {
    startLine = line.range.start.line + before;
    if (line.text === "\n") {
      newEditedLine.push(line);
    } else {
      line.text.split(/\n/).map(text => {
        newEditedLine.push(generateTextDocumentContentChange(startLine++, line.text));
        before++;
      });
      before--;
    }
  });
  return newEditedLine.reverse();
}

function updatePositionsForDeletion(range, positions) {
  let rangeLength = range.end.line - range.start.line;
  positions.forEach(position => {
    if (position.newPosition === null) {
      return;
    }
    if (position.oldPosition >= range.start.line && position.oldPosition < (range.end.line + 1)) {
      position.newPosition = null;
      return;
    }
    if (position.oldPosition >= range.end.line) {
      position.newPosition = position.newPosition - rangeLength;
    }
    if (position.newPosition < 0) {
      position.newPosition = 0;
    }
  });
  return positions;
}

function handleLineRemoved(editedLine: TextDocumentContentChangeEvent[], positions) {
  editedLine.reverse();
  editedLine.forEach((line) => {
    positions = updatePositionsForDeletion(line.range, positions);
  });
  editedLine.reverse();

  return mutEditedLIneForDeletion(editedLine);
}

function handleLineDiff(editedLine: TextDocumentContentChangeEvent[], context, diffLine: number) {
  let positions = mapKeysToArray(context.deco).map(position => Object({
    oldPosition: position,
    newPosition: position
  }));

  if (diffLine < 0) {
    editedLine = handleLineRemoved(editedLine, positions);
  } else {
    editedLine = handleLineAdded(editedLine, positions);
  }
  positions = positions.filter(position => {
    if (position.newPosition === null) {
      context.deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
      return false;
    }
    return true;
  });
  let newDeco = new Map();
  positions.forEach(position => {
    if (newDeco.has(position.newPosition)) {
      newDeco.set(position.newPosition, newDeco.get(position.newPosition).concat(context.deco.get(position.oldPosition)));
    } else {
      newDeco.set(position.newPosition, context.deco.get(position.oldPosition));
    }
  });
  context.deco = newDeco;
  return editedLine;
}

function handleLineAdded(editedLine: TextDocumentContentChangeEvent[], position) {
  editedLine = mutEditedLIne(editedLine);
  editedLine.forEach((line) => {
    position.forEach(position => {
      if (position.oldPosition > line.range.start.line) {
        position.newPosition = position.newPosition + 1;
      }
    });
  });
  return editedLine;
}

function updateDecorations(editedLine: TextDocumentContentChangeEvent[], context, cb: Function) {
  let diffLine = context.current_editor.document.lineCount - context.nbLine;

  if (diffLine !== 0) {
    editedLine = handleLineDiff(editedLine, context, diffLine);
    context.nbLine = context.current_editor.document.lineCount;
  }
  checkDecorationForUpdate(editedLine, context, cb);
}

function checkDecorationForUpdate(editedLine: TextDocumentContentChangeEvent[], context, cb) {
  Promise.all(
    editedLine.map(({range}: TextDocumentContentChangeEvent) => {
      if (context.deco.has(range.start.line)) {
        context.deco.get(range.start.line).forEach(decoration => {
          decoration.dispose();
        });
      }
      context.deco.set(range.start.line, []);

      return ColorUtil.findColors(context.current_editor.document.lineAt(range.start.line).text)
              .then(colors => generateDecorations(colors, range.start.line, context))
              .then(decorateEditor);
    })

  ).then(cb);
}

function initDecorations(context, cb) {
  if (!context.current_editor) {
    return;
  }
  context.nbLine = context.current_editor.document.lineCount;

  let text = context.current_editor.document.getText(); // should read line by line instead or not?
  let n: number = context.current_editor.document.lineCount;

  Promise.all(context.current_editor.document.getText().split(/\n/).map((text, index) => ColorUtil.findColors(text)
                                            .then(colors => generateDecorations(colors, index, context))
                                            .then(decorateEditor))).then(cb);

}

function generateDecorations(colors: Color[], line, context) {
  colors.forEach((color) => {
    let startPos = new Position(line, color.positionInText);
    let endPos = new Position(line, color.positionInText + color.value.length);
    let range = new Range(startPos, endPos);
    if (context.deco.has(line)) {
      context.deco.set(line, context.deco.get(line).concat([new ColorDecoration(range, color)]));
    } else {
      context.deco.set(line, [new ColorDecoration(range, color)]);
    }
  });
  return context;
}

function decorateEditor(context) {
  let it = context.deco.entries();
  let tmp = it.next();
  while (!tmp.done) {
    tmp.value[1].forEach(decoration => context.current_editor.setDecorations(decoration.decoration, [decoration.textPosition]));
    tmp = it.next();
  }
  return;
}

export function activate(context: ExtensionContext) {
  let decorations: Map < string, Map < number, ColorDecoration[] > > = new Map();
  let extension = {
    current_editor: window.activeTextEditor,
    nbLine: 0,
    deco: null
  };
  let q = new Queue();

  if (extension.current_editor) {
      extension.deco = new Map();
    decorations.set(extension.current_editor.document.fileName, extension.deco);
    q.push((cb) => {
      initDecorations(extension, cb);
    });
  }
  window.onDidChangeActiveTextEditor(newEditor => {
    extension.current_editor = newEditor;
    if (newEditor && !decorations.has(newEditor.document.fileName)) {
      extension.deco = new Map();
    } else {
      extension.deco = decorations.get(newEditor.document.fileName);
    }
    return q.push((cb) => initDecorations(extension, cb));

  }, null, context.subscriptions);

  workspace.onDidChangeTextDocument((event: TextDocumentChangeEvent) => {
    if (extension.current_editor && event.document === extension.current_editor.document) {
      q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    }
  }, null, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {}
