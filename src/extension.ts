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

import Color from './util/color';
import ColorUtil from './color-util';
import ColorDecoration from './color-decoration';
import Queue from './queue';
import ColorExtractor from './util/extractors/color-extractor';

let config = {
  languages: null,
  filesExtensions: null
};

interface ColorizeContext {
  editor: TextEditor;
  nbLine: number;
  deco: Map < number, ColorDecoration[] >;
}

let extension: ColorizeContext = {
  editor: window.activeTextEditor,
  nbLine: 0,
  deco: null
};
let filesDecorations: Map < string, Map < number, ColorDecoration[] > > = new Map();

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
};

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
  // debugger;
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
  // debugger;
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
            .then(colors => generateDecorations(colors, range.start.line, m))
        } catch (e) { // use promise catch instead?
          return context.deco;
        }
      })
    ).then(() => {
      decorateEditor(context.editor, m);
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
        "text": text,
        "line": index
      }))
      .map(line => ColorUtil.findColors(line.text)
        .then(colors => generateDecorations(colors, line.line, context.deco))))
    .then(() => decorateEditor(context.editor, context.deco))
    .then(cb);
}

function generateDecorations(colors: Color[], line: number, decorations: Map<number, ColorDecoration[]>) {
  colors.forEach((color) => {
    let startPos = new Position(line, color.positionInText);
    let endPos = new Position(line, color.positionInText + color.value.length);
    let range = new Range(startPos, endPos);
    if (decorations.has(line)) {
      decorations.set(line, decorations.get(line).concat([new ColorDecoration( /*range, */ color)]));
    } else {
      decorations.set(line, [new ColorDecoration( /*range, */ color)]);
    }
  });
  return decorations; // return decoration instead?
}

function decorateEditor(editor: TextEditor, decorations: Map<number, ColorDecoration[]>) {
  let it = decorations.entries();
  let tmp = it.next();
  while (!tmp.done) {
    let line = tmp.value[0];
    // tmp.value[1].forEach(decoration => context.current_editor.setDecorations(decoration.decoration, [decoration.textPosition]));
    tmp.value[1].forEach(decoration => editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]));
    tmp = it.next();
  }
  return;
}

function isLanguageSupported(languageId): boolean {
  return config.languages.indexOf(languageId) !== -1;
}

function isFileExtenstionSupported(fileName): boolean {
  return config.filesExtensions.find(ext => ext.test(fileName));
}

function isSupported(document: TextDocument) {
  return isLanguageSupported(document.languageId) || isFileExtenstionSupported(document.fileName);
}

function colorize(editor: TextEditor, cb) {
   if (!editor) {
    return cb();
  }
  if (!isSupported(editor.document)) {
    return cb();
  }
  extension.editor = editor;
  if (filesDecorations.has(editor.document.fileName)) {
    extension.deco = filesDecorations.get(editor.document.fileName);
    extension.nbLine = editor.document.lineCount;
    updateDecorations([], extension, cb);
  } else {
    extension.deco = new Map();
    filesDecorations.set(extension.editor.document.fileName, extension.deco);
    extension.nbLine = editor.document.lineCount;
    initDecorations(extension, cb);
  }
};

export function activate(context: ExtensionContext) {
  const configuration = workspace.getConfiguration('colorize');
  config.languages = configuration.get('languages', []);
  config.filesExtensions = configuration.get('files_extensions', []).map(ext => RegExp(`\\${ext}$`));

  window.onDidChangeActiveTextEditor(editor => {
    console.log(editor.document);

    window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
      q.push(cb => colorize(e, cb));
    });
    q.push(cb => colorize(editor, cb));
  }, null, context.subscriptions);
  workspace.onDidChangeTextDocument((event: TextDocumentChangeEvent) => {
    if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
      q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    }
  }, null, context.subscriptions);

  window.visibleTextEditors.forEach(editor => {
    q.push(cb => colorize(editor, cb));
  });
}

// this method is called when your extension is deactivated
export function deactivate() {

  // need to clean up everything
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
///////////////////                                   ///////////////////
/////////////////// generate decorations one by one ? ///////////////////
///////////////////                                   ///////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
