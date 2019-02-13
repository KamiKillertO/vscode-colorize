'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  workspace,
  ExtensionContext,
  TextEditor,
  TextDocument,
  TextDocumentChangeEvent,
  TextDocumentContentChangeEvent,
  TextEditorSelectionChangeEvent,
  Selection,
} from 'vscode';
import Variable from './lib/variables/variable';
import ColorUtil, { IDecoration, DocumentLine, LineExtraction } from './lib/util/color-util';
import Queue from './lib/queue';
import VariablesManager from './lib/variables/variables-manager';
import CacheManager from './lib/cache-manager';
import EditorManager from './lib/editor-manager';
import { mapKeysToArray } from './lib/util/array';
import * as globToRegexp from 'glob-to-regexp';
import VariableDecoration from './lib/variables/variable-decoration';
import { mutEditedLIne } from './lib/util/mut-edited-line';
import { getColorizeConfig, ColorizeConfig } from './lib/colorize-config';


let config: ColorizeConfig = {
  languages: [],
  filesExtensions: [],
  isHideCurrentLineDecorations: true,
  colorizedVariables: [],
  colorizedColors: [],
  filesToExcludes: [],
  filesToIncludes: [],
  inferedFilesToInclude: [],
  searchVariables: false
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
  deco: new Map(),
  currentSelection: null
};

const q = new Queue();

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

function handleLineRemoved(editedLine: TextDocumentContentChangeEvent[], positions, context: ColorizeContext) {
  editedLine.reverse();
  editedLine.forEach((line: TextDocumentContentChangeEvent) => {
    for (let i = line.range.start.line; i <= line.range.end.line; i++) {
    // ?
    // for (let i = line.range.start.line; i <= context.editor.document.lineCount; i++) {
      VariablesManager.deleteVariableInLine(extension.editor.document.fileName, i);
    }
    positions = updatePositionsDeletion(line.range, positions);
  });
  return editedLine;
}

function handleLineAdded(editedLine: TextDocumentContentChangeEvent[], position, context: ColorizeContext) {
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
    editedLine = handleLineRemoved(editedLine, positions, context);
  } else {
    editedLine = handleLineAdded(editedLine, positions, context);
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
function updateContextDecorations(decorations: Map<number, IDecoration[]>, context: ColorizeContext) {
  let it = decorations.entries();
  let tmp = it.next();
  while (!tmp.done) {
    let line = tmp.value[0];
    if (context.deco.has(line)) {
      context.deco.set(line, context.deco.get(line).concat(decorations.get(line)));
    } else {
      context.deco.set(line, decorations.get(line));
    }
    tmp = it.next();
  }
}

function removeDuplicateDecorations(context: ColorizeContext) {
  let it = context.deco.entries();
  let m: Map<number, IDecoration[]> = new Map();
  let tmp = it.next();

  while (!tmp.done) {
    let line = tmp.value[0];
    let decorations = tmp.value[1];
    let newDecorations = [];
    decorations.forEach((deco: VariableDecoration, i) => {
      deco.generateRange(line);
      const exist = newDecorations.findIndex((_: IDecoration) => deco.currentRange.isEqual(_.currentRange));
      if (exist !== -1) {
        newDecorations[exist].dispose();
        newDecorations = newDecorations.filter((_, i) => i === exist);
      }
      newDecorations.push(deco);
    });
    m.set(line, newDecorations);
    tmp = it.next();
  }
  context.deco = m;
}

async function checkDecorationForUpdate(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb) {
  const text = context.editor.document.getText().split(/\n/);
  const fileLines: DocumentLine[] = editedLine.map(({range}: TextDocumentContentChangeEvent) => {
    const line = range.start.line;
    if (context.deco.has(line)) {
      context.deco.get(line).forEach(decoration => {
        decoration.dispose();
      });
    }
    return {line, text: text[line]};
  });
  try {
    let variables: LineExtraction[] = [];
    const lines: DocumentLine[] = ColorUtil.textToFileLines(context.editor.document.getText());
    VariablesManager.removeVariablesDeclarations(context.editor.document.fileName);
    await VariablesManager.findVariablesDeclarations(context.editor.document.fileName, lines);
    variables = await VariablesManager.findVariables(context.editor.document.fileName, lines);

    const colors: LineExtraction[] = await ColorUtil.findColors(fileLines, context.editor.document.fileName);

    const decorations = generateDecorations(colors, variables, new Map());

    removeDuplicateDecorations(context);
    EditorManager.decorate(context.editor, decorations, context.currentSelection);
    updateContextDecorations(decorations, context);
    removeDuplicateDecorations(context);
  } catch (error) {
  }
  return cb();
}

async function initDecorations(context: ColorizeContext) {
  if (!context.editor) {
    return;
  }
  let text = context.editor.document.getText();

  const fileLines: DocumentLine[] = ColorUtil.textToFileLines(text);
  // removeDuplicateDecorations(context);
  await VariablesManager.findVariablesDeclarations(context.editor.document.fileName, fileLines);
  let variables: LineExtraction[] = await VariablesManager.findVariables(context.editor.document.fileName, fileLines);
  const colors: LineExtraction[] = await ColorUtil.findColors(fileLines);
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
    const decoration = VariablesManager.generateDecoration(<Variable>variable, line);
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
 * @param {string} fileName A valid filename (path to the file)
 * @returns {boolean}
 */
function isFileExtensionSupported(fileName: string): boolean {
  return config.filesExtensions.some((ext: RegExp) => ext.test(fileName));
}

/**
 * Check if the file is the `colorize.include` setting
 *
 * @param {string} fileName A valid filename (path to the file)
 * @returns {boolean}
 */
function isIncludedFile(fileName: string): boolean {
  return config.filesToIncludes.find((globPattern: string) => globToRegexp(globPattern).test(fileName)) !== undefined;
}

/**
 * Check if a file can be colorized by COLORIZE
 *
 * @param {TextDocument} document The document to test
 * @returns {boolean}
 */
function canColorize(document: TextDocument) { // update to use filesToExcludes. Remove `isLanguageSupported` ? checking path with file extension or include glob pattern should be enough
  return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName) || isIncludedFile(document.fileName);
}

function handleTextSelectionChange(event: TextEditorSelectionChangeEvent, cb: Function) {
  if (!config.isHideCurrentLineDecorations || event.textEditor !== extension.editor) {
    return cb();
  }
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
      decorations.forEach(_ => _.hide());
    }
  });
  extension.currentSelection = event.selections.map((selection: Selection) => selection.active.line);
  return cb();
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
  extension.editor = null;
  extension.deco = new Map();
  if (!editor || !canColorize(editor.document)) {
    return cb();
  }
  extension.editor = editor;
  extension.currentSelection = editor.selections.map((selection: Selection) => selection.active.line);
  const deco = CacheManager.getCachedDecorations(editor.document);
  if (deco) {
    extension.deco = deco;
    extension.nbLine = editor.document.lineCount;

    EditorManager.decorate(extension.editor, extension.deco, extension.currentSelection);
  } else {
    extension.nbLine = editor.document.lineCount;
    try {
      await initDecorations(extension);
    } finally {
      CacheManager.saveDecorations(extension.editor.document, extension.deco);
    }
  }
  return cb();
}

function handleChangeActiveTextEditor(editor: TextEditor) {
  if (extension.editor !== undefined && extension.editor !== null) {
    extension.deco.forEach(decorations => decorations.forEach(deco => deco.hide()));
    CacheManager.saveDecorations(extension.editor.document, extension.deco);
  }
  window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
    q.push(cb => colorize(e, cb));
  });
  q.push(cb => colorize(editor, cb));
}

function cleanDecorationList(context: ColorizeContext, cb) {
  let it = context.deco.entries();
  let tmp = it.next();
  while (!tmp.done) {
    let line = tmp.value[0];
    let decorations = tmp.value[1];
    context.deco.set(line, decorations.filter(decoration => !decoration.disposed));
    tmp = it.next();
  }
  return cb();
}

function handleChangeTextDocument(event: TextDocumentChangeEvent) {
  if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
    extension.editor = window.activeTextEditor;
    q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    q.push((cb) => cleanDecorationList(extension, cb));
  }
}

function clearCache() {
  extension.deco.clear();
  extension.deco = new Map();
  CacheManager.clearCache();
}

function handleConfigurationChanged() {
  const newConfig = getColorizeConfig();
  clearCache();
  // delete current decorations then regenerate decorations
  ColorUtil.setupColorsExtractors(newConfig.colorizedColors);

  q.push(async (cb) => {
    // remove event listeners?
    VariablesManager.setupVariablesExtractors(newConfig.colorizedVariables);

    if (newConfig.searchVariables) {
      await VariablesManager.getWorkspaceVariables(newConfig.filesToIncludes.concat(newConfig.inferedFilesToInclude), newConfig.filesToExcludes); // 👍
    }
    return cb();
  });
  config = newConfig;
  colorizeVisibleTextEditors();
}

function initEventListeners(context: ExtensionContext) {
  window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);
  workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
  workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
  window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);
  workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
  workspace.onDidChangeConfiguration(handleConfigurationChanged, null, context.subscriptions);
}

function colorizeVisibleTextEditors() {
  window.visibleTextEditors.forEach(editor => {
    q.push(cb => colorize(editor, cb));
  });
}

export function activate(context: ExtensionContext) {
  config = getColorizeConfig();
  ColorUtil.setupColorsExtractors(config.colorizedColors);
  VariablesManager.setupVariablesExtractors(config.colorizedVariables);
  q.push(async cb => {
    try {
      if (config.searchVariables) {
        await VariablesManager.getWorkspaceVariables(config.filesToIncludes.concat(config.inferedFilesToInclude), config.filesToExcludes); // 👍
      }

      initEventListeners(context);
    } catch (error) {
      // handle promise rejection
    }
    return cb();
  });
  colorizeVisibleTextEditors();
}

// this method is called when your extension is deactivated
export function deactivate() {
  extension.nbLine = null;
  extension.editor = null;
  extension.deco.clear();
  extension.deco = null;
  CacheManager.clearCache();
}

export { canColorize, ColorizeContext, colorize };
