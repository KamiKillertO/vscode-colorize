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
  Selection,
  StatusBarAlignment,
  Uri,
  WorkspaceConfiguration
} from 'vscode';
import Color, { IColor } from './lib/colors/color';
import Variable from './lib/variables/variable';
import ColorUtil, { IDecoration, DocumentLine, LineExtraction } from './lib/color-util';
import ColorDecoration from './lib/colors/color-decoration';
import Queue from './lib/queue';
import ColorExtractor from './lib/colors/color-extractor';
import VariableDecoration from './lib/variables/variable-decoration';
import VariablesManager from './lib/variables/variables-manager';
import CacheManager from './lib/cache-manager';
import EditorManager from './lib/editor-manager';
import color from './lib/colors/color';

let config = {
  languages: null,
  filesExtensions: null
};

interface ColorizeContext {
  editor: TextEditor;
  nbLine: number;
  deco: Map < number, IDecoration[] >;
  currentSelection: number[];
}

let extension: ColorizeContext = {
  editor: window.activeTextEditor,
  nbLine: 0,
  deco: null,
  currentSelection: null
};

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
  editedLine.forEach((line: TextDocumentContentChangeEvent) => {
    for (let i = line.range.start.line; i <= line.range.end.line; i++) {
      VariablesManager.deleteVariableInLine(extension.editor.document.fileName, i);
    }
    positions = updatePositionsDeletion(line.range, positions);
  });
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

function filterPositions(position, deco, diffLine) {
  if (position.newPosition === null) {
    deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
    return false;
  }
  if (position.newPosition === 0 && extension.editor.document.lineCount === 1 && extension.editor.document.lineAt(0).text === '') {
    deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
    return false;
  }
  if (Math.abs(position.oldPosition - position.newPosition) > Math.abs(diffLine)) {
    position.newPosition = position.oldPosition + diffLine;
  }
  return true;
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
  positions = positions.filter(position => filterPositions(position, context.deco, diffLine));
  context.deco = positions.reduce((decorations, position) => {
    if (decorations.has(position.newPosition)) {
      return decorations.set(position.newPosition, decorations.get(position.newPosition).concat(context.deco.get(position.oldPosition)));
    }
    return decorations.set(position.newPosition, context.deco.get(position.oldPosition));
  }, new Map());
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

async function checkDecorationForUpdate(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb) {
  let m = new Map();
  const text = context.editor.document.getText().split(/\n/);
  const fileLines: DocumentLine[] = editedLine.map(({range}: TextDocumentContentChangeEvent) => {
    const line = range.start.line;
    if (context.deco.has(line)) {
      context.deco.get(line).forEach(decoration => {
        decoration.dispose();
      });
    }
    context.deco.set(line, []);
    return {line, text: text[line]};
  });

  try {
    // should not run if variables support not activated
    await VariablesManager.findVariablesDeclarations(context.editor.document.fileName, fileLines);

    const colors: LineExtraction[] = await ColorUtil.findColors(fileLines, context.editor.document.fileName);
    // should not run if variables support not activated
    const variables = await VariablesManager.findVariables(context.editor.document.fileName, fileLines);

    generateDecorations(colors, variables, m);
  } catch (e) {
    return cb();
  }
  EditorManager.decorate(context.editor, m, context.currentSelection);
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
  return cb();
}

async function initDecorations(context: ColorizeContext) {
  if (!context.editor) {
    return;
  }
  let text = context.editor.document.getText();
  let n: number = context.editor.document.lineCount;
  const start = Date.now();

  const fileLines: DocumentLine[] = ColorUtil.textToFileLines(context.editor.document.getText());
  const colors: LineExtraction[] = await ColorUtil.findColors(fileLines);

  // should not run if variables support not activated
  const variables = await VariablesManager.findVariables(context.editor.document.fileName, fileLines);

  generateDecorations(colors, variables, context.deco);
  return EditorManager.decorate(context.editor, context.deco, context.currentSelection);
}

function updateDecorationMap(map: Map<number, IDecoration[]>, line: number, decoration: IDecoration ) {
  if (map.has(line)) {
    map.set(line, map.get(line).concat([decoration]));
  } else {
    map.set(line, [decoration]);
  }
}
function generateDecorations(colors: LineExtraction[], variables: LineExtraction[], decorations: Map<number, IDecoration[]>) {

  colors.map(({line, colors}) => colors.forEach((color) => {
    const decoration = ColorUtil.generateDecoration(color);
    updateDecorationMap(decorations, line, decoration);
  }));
  variables.map(({line, colors}) => colors.forEach((variable) => {
    const decoration = VariablesManager.generateDecoration(<Variable>variable);
    updateDecorationMap(decorations, line, decoration);
  }));
  return decorations;
}

/**
 * Check if COLORIZE support a language
 *
 * @param {string} languageId A valid languageId
 * @returns {boolean}
 */
function isLanguageSupported(languageId: string): boolean {
  return config.languages.indexOf(languageId) !== -1;
}

/**
 * Check if COLORIZE support a file extension
 *
 * @param {string} fileName A valid file extension
 * @returns {boolean}
 */
function isFileExtensionSupported(fileName: string): boolean {
  return config.filesExtensions.find((ext: RegExp) => ext.test(fileName));
}
/**
 * Check if a file can be colorized by COLORIZE
 *
 * @param {TextDocument} document The document to test
 * @returns {boolean}
 */
function canColorize(document: TextDocument) {
  return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName);
}

function handleTextSelectionChange(event: TextEditorSelectionChangeEvent) {
  if (event.textEditor !== extension.editor) {
    return;
  }
  q.push(cb => {
    if (extension.currentSelection.length !== 0) {
      extension.currentSelection.forEach(line => {
        const decorations = extension.deco.get(line);
        if (decorations !== undefined) {
          EditorManager.decorateOneLine(extension.editor, decorations, line);
        }
      });
    }
    extension.currentSelection =  [];
    event.selections.forEach((selection: Selection) => {
      let decorations = extension.deco.get(selection.active.line);
      if (decorations) {
        decorations.forEach(_ => _.dispose());
      }
    });
    extension.currentSelection = event.selections.map((selection: Selection) => selection.active.line);
    return cb();
  });
}

function handleCloseOpen(document) {
  q.push((cb) => {
    if (extension.editor && extension.editor.document.fileName === document.fileName) {
      CacheManager.saveDecorations(document, extension.deco);
      return cb();
    }
    return cb();
  });
}

async function colorize(editor: TextEditor, cb) {
  if (!editor) {
    return cb();
  }
  if (!canColorize(editor.document)) {
    return cb();
  }
  extension.editor = editor;
  extension.currentSelection = editor.selections.map((selection: Selection) => selection.active.line);
  const deco = CacheManager.getCachedDecorations(editor.document);
  if (deco) {
    extension.deco = deco;
    extension.nbLine = editor.document.lineCount;
    EditorManager.decorate(extension.editor, extension.deco, extension.currentSelection);
    return cb();
  }
  extension.deco = new Map();
  extension.nbLine = editor.document.lineCount;
  try {
    await initDecorations(extension);
  } catch (error) {
    return cb();
  }
  CacheManager.saveDecorations(extension.editor.document, extension.deco);
  return cb();
}

function handleChangeActiveTextEditor(editor: TextEditor) {
  if (extension.editor !== undefined && extension.editor !== null) {
    CacheManager.saveDecorations(extension.editor.document, extension.deco);
  }
  window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
    q.push(cb => colorize(e, cb));
  });
  q.push(cb => colorize(editor, cb));
}

function handleChangeTextDocument(event: TextDocumentChangeEvent) {
  if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
    extension.editor = window.activeTextEditor;
    q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
  }
}

function initEventListeners(context: ExtensionContext, configuration: WorkspaceConfiguration) {

  if (configuration.get('hide_current_line_decorations') === true) {
    window.onDidChangeTextEditorSelection(handleTextSelectionChange, null, context.subscriptions);
  }
  workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);

  workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);

  window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);

  workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
}

export function activate(context: ExtensionContext) {
  const configuration: WorkspaceConfiguration = workspace.getConfiguration('colorize');
  config.languages = configuration.get('languages', []);
  config.filesExtensions = configuration.get('files_extensions', []).map(ext => RegExp(`\\${ext}$`));

  if (configuration.get('activate_variables_support_beta') === true) {
    q.push(async cb => {
      try {
        await VariablesManager.getWorkspaceVariables();
        initEventListeners(context, configuration);
      } catch (error) {
        // handle promise rejection
      }
      return cb();
    });
  } else {
    initEventListeners(context, configuration);
  }

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
  CacheManager.clearCache();
}

export { canColorize };
