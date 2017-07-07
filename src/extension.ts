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
  TextDocumentContentChangeEvent,
  TextEditorSelectionChangeEvent,
  // TextEditorSelectionChangeKind,
  Selection
} from 'vscode';

import Color from './lib/color';
import ColorUtil from './lib/color-util';
import ColorDecoration from './lib/color-decoration';
import Queue from './lib/queue';
import ColorExtractor from './lib/extractors/color-extractor';

let config = {
  languages: null,
  filesExtensions: null
};

interface ColorizeContext {
  editor: TextEditor;
  nbLine: number;
  deco: Map < number, ColorDecoration[] >;
  currentSelection: number;
}

let extension: ColorizeContext = {
  editor: window.activeTextEditor,
  nbLine: 0,
  deco: null,
  currentSelection: null
};
let dirtyFilesDecorations: Map < string, Map < number, ColorDecoration[] > > = new Map();
let savedFilesDecorations: Map < string, Map < number, ColorDecoration[] > > = new Map();

const q = new Queue();

// Return all map's keys in an array
function mapKeysToArray(map: Map < number, any > ) {
  let it = map.keys();
  let tmp = it.next();
  let array = [];
  while (!tmp.done) {
    array.push(tmp.value);
    tmp = it.next();
  }
  return array;
}

// Generate a TextDocumentContentChangeEvent like object for one line
function generateTextDocumentContentChange(line: number, text: string): TextDocumentContentChangeEvent {
  return {
    rangeLength: 0,
    text: text,
    range: new Range(new Position(line, 0), new Position(line, text.length))
  };
}
// Split the TextDocumentContentChangeEvent into multiple line if the added text contain multiple lines
// example :
//  let editedLine = [{
//  rangeLength: 0,
//  text: 'a\nb\nc\n',
//  range: {start:{line:1}, end:{line:1}}
// }]
// became
//  let editedLine = [{
//  rangeLength: 0,
//  text: 'a',
//  range: {start:{line:1,/*...*/}, end:{line:1,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: 'b',
//  range: {start:{line:2,/*...*/}, end:{line:2,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: 'c',
//  range: {start:{line:3,/*...*/}, end:{line:3,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: '',
//  range: {start:{line:4,/*...*/}, end:{line:4,/*...*/}}
// }]
//
function mutEditedLIne(editedLine: TextDocumentContentChangeEvent[]): TextDocumentContentChangeEvent[] {
  let newEditedLine: TextDocumentContentChangeEvent[] = [];
  let startLine = 0;
  let before = 0;
  editedLine.reverse();
  editedLine.forEach(line => {
    let a = line.text.match(/\n/g);
    startLine = line.range.start.line + before;
    line.text.split(/\n/).map((text, i, array) => {
      if (i === 0 && text === '' && array.length === 1) {
        startLine++;
      } else {
        newEditedLine.push(generateTextDocumentContentChange(startLine++, text));
      }
      before++;
    });
    before--;
  });
  return newEditedLine;
}

function updatePositionsDeletion(range, positions) {
  let rangeLength = range.end.line - range.start.line;
  positions.forEach(position => {
    if (position.newPosition === null) {
      return;
    }
    if (position.oldPosition > range.start.line && position.oldPosition <= range.end.line) {
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
    positions = updatePositionsDeletion(line.range, positions);
  });
  return editedLine;
}

function handleLineDiff(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, diffLine: number) {
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
    if (position.newPosition === 0 && extension.editor.document.lineCount === 1 && extension.editor.document.lineAt(0).text === '') {
      context.deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
      return false;
    }
    if (Math.abs(position.oldPosition - position.newPosition) > Math.abs(diffLine)) {
      position.newPosition = position.oldPosition + diffLine;
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
      if (position.newPosition >= line.range.start.line) {
        position.newPosition = position.newPosition + 1;
      }
    });
  });

  return editedLine;
}

function updateDecorations(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb: Function) {
  let diffLine = context.editor.document.lineCount - context.nbLine;
  let positions;
  if (diffLine !== 0) {
    editedLine = handleLineDiff(editedLine, context, diffLine);
    context.nbLine = context.editor.document.lineCount;
  }
  checkDecorationForUpdate(editedLine, context, cb);
}

function checkDecorationForUpdate(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb) {
  let m = new Map();
  Promise.all(
      editedLine.map(({
        range
      }: TextDocumentContentChangeEvent) => {
        if (context.deco.has(range.start.line)) {
          context.deco.get(range.start.line).forEach(decoration => {
            decoration.dispose();
          });
        }
        context.deco.set(range.start.line, []);
        // lineAt raise an exception if line does not exist
        try { // not really good
          return ColorUtil.findColors(context.editor.document.lineAt(range.start.line).text)
            .then(colors => generateDecorations(colors, range.start.line, m));
        } catch (e) { // use promise catch instead?
          return context.deco;
        }
      })
    ).then(() => {
      decorateEditor(context);
      let it = m.entries();
      let tmp = it.next();
      while (!tmp.done) {
        let line = tmp.value[0];
        if (context.deco.has(line)) {
          context.deco.set(line, context.deco.get(line).concat(m.get(line)));
        } else {
          context.deco.set(line, m.get(line));
        }
        tmp = it.next();
      }
    })
    .then(cb);
}

function initDecorations(context: ColorizeContext, cb) {
    if (!context.editor) {
    return cb();
  }

  let text = context.editor.document.getText();
  let n: number = context.editor.document.lineCount;
  Promise.all(context.editor.document.getText()
      .split(/\n/)
      .map((text, index) => Object({
        'text': text,
        'line': index
      }))
      .map(line => ColorUtil.findColors(line.text)
        .then(colors => generateDecorations(colors, line.line, context.deco))))
    .then(() => decorateEditor(context))
    .then(cb);
}
// Mut context ><
function generateDecorations(colors: Color[], line: number, decorations: Map<number, ColorDecoration[]>) {
  colors.forEach((color) => {
    let startPos = new Position(line, color.positionInText);
    let endPos = new Position(line, color.positionInText + color.value.length);
    if (decorations.has(line)) {
      decorations.set(line, decorations.get(line).concat([new ColorDecoration(color)]));
    } else {
      decorations.set(line, [new ColorDecoration(color)]);
    }
  });
  return decorations;
}
// Run through all decoration to generate editor's decorations
function decorateEditor(context: ColorizeContext) {
  let it = context.deco.entries();
  let tmp = it.next();
  while (!tmp.done) {
    let line = tmp.value[0];
    if (line !== context.currentSelection) {
      decorateLine(context.editor, tmp.value[1], line);
    }
    tmp = it.next();
  }
  return;
}
// Decorate editor's decorations for one line
function decorateLine(editor: TextEditor, decorations: ColorDecoration[], line: number) {
  decorations.forEach(decoration => editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]));
}
function isLanguageSupported(languageId): boolean {
  return config.languages.indexOf(languageId) !== -1;
}

function isFileExtensionSupported(fileName): boolean {
  return config.filesExtensions.find(ext => ext.test(fileName));
}

function isSupported(document: TextDocument) {
  return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName);
}

function colorize(editor: TextEditor, cb) {
  if (!editor) {
    return cb();
  }
  if (!isSupported(editor.document)) {
    return cb();
  }
  extension.editor = editor;
  extension.currentSelection = null;
  const deco = getDecorations(editor);
  if (deco) {
    extension.deco = deco;
    extension.nbLine = editor.document.lineCount;
    decorateEditor(extension);
    return cb();
  }
  extension.deco = new Map();
  extension.nbLine = editor.document.lineCount;
  return initDecorations(extension, () => {
    saveDecorations(extension.editor.document, extension.deco);
    return cb();
  });
}

function getDecorations(editor: TextEditor): Map<number, ColorDecoration[]> | null  {
  if (!editor.document.isDirty && savedFilesDecorations.has(editor.document.fileName)) {
    return savedFilesDecorations.get(editor.document.fileName);
  }
  if (dirtyFilesDecorations.has(editor.document.fileName)) {
    return dirtyFilesDecorations.get(editor.document.fileName);
  }
  return null;
}

function saveDecorations(document: TextDocument, deco: Map<number, ColorDecoration[]>) {
  document.isDirty ? _saveDirtyDecoration(document.fileName, deco) : _saveSavedDecorations(document.fileName, deco);
}

function _saveDirtyDecoration(fileName: string, decorations: Map<number, ColorDecoration[]>) {
  return dirtyFilesDecorations.set(fileName, decorations);
}

function _saveSavedDecorations(fileName: string, decorations: Map<number, ColorDecoration[]>) {
  return savedFilesDecorations.set(fileName, decorations);
}

function handleTextSelectionChange(event: TextEditorSelectionChangeEvent) {
  if (event.textEditor !== extension.editor) {
    return;
  }
  // if (event.kind !== TextEditorSelectionChangeKind.Mouse || event.kind === TextEditorSelectionChangeKind.Keyboard ) { // 'command' kind is fired when click occur inside a selected zone
  // vscode issue?
  if (event.kind !== undefined ) {
    q.push(cb => {
      if (extension.currentSelection !== null && extension.deco.get(extension.currentSelection) !== undefined) {
        decorateLine(extension.editor, extension.deco.get(extension.currentSelection), extension.currentSelection);
      }
      extension.currentSelection =  null;
      event.selections.forEach((selection: Selection) => {
        let decorations = extension.deco.get(selection.active.line);
        if (decorations) {
          extension.currentSelection = selection.active.line;
          decorations.forEach(_ => _.dispose());
        }
      });
      return cb();
    });
//   }
}

export function activate(context: ExtensionContext) {
  const configuration = workspace.getConfiguration('colorize');
  config.languages = configuration.get('languages', []);
  config.filesExtensions = configuration.get('files_extensions', []).map(ext => RegExp(`\\${ext}$`));

  if (configuration.get('hide_current_line_decorations') === true) {
    window.onDidChangeTextEditorSelection(handleTextSelectionChange, null, context.subscriptions);
  }

  workspace.onDidCloseTextDocument(document => {
    q.push((cb) => {
      if (extension.editor && extension.editor.document.fileName === document.fileName) {
        saveDecorations(document, extension.deco);
        return cb();
      }
      return cb();
    });
  }, null, context.subscriptions);

  workspace.onDidSaveTextDocument(document => {
    q.push((cb) => {
      if (extension.editor && extension.editor.document.fileName === document.fileName) {
        saveDecorations(document, extension.deco);
        return cb();
      }
      return cb();
    });
  }, null, context.subscriptions);

  window.onDidChangeActiveTextEditor(editor => {
    if (extension.editor !== null) {
      saveDecorations(extension.editor.document, extension.deco);
    }
    window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
      q.push(cb => colorize(e, cb));
    });
    q.push(cb => colorize(editor, cb));
  }, null, context.subscriptions);

  workspace.onDidChangeTextDocument((event: TextDocumentChangeEvent) => {
    if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
      extension.editor = window.activeTextEditor;
      q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    }
  }, null, context.subscriptions);

  window.visibleTextEditors.forEach(editor => {
    q.push(cb => colorize(editor, cb));
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  extension.nbLine = null;
  extension.editor = null;
  extension.deco.clear();
  extension.deco = null;
  dirtyFilesDecorations.clear();
  dirtyFilesDecorations = null;
  savedFilesDecorations.clear();
  savedFilesDecorations = null;
}
