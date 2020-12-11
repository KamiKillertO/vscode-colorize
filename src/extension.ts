'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  workspace,
  ExtensionContext,
  TextEditor,
  TextDocument,
  TextEditorSelectionChangeEvent,
  Selection,
  Range
} from 'vscode';
import Variable from './lib/variables/variable';
import ColorUtil, { IDecoration, DocumentLine, LineExtraction } from './lib/util/color-util';
import Queue from './lib/queue';
import VariablesManager from './lib/variables/variables-manager';
import CacheManager from './lib/cache-manager';
import EditorManager from './lib/editor-manager';
import * as globToRegexp from 'glob-to-regexp';
import VariableDecoration from './lib/variables/variable-decoration';
import { getColorizeConfig, ColorizeConfig } from './lib/colorize-config';

import OldListeners from './listeners_old';
import NewListeners from './listeners_new';

let config: ColorizeConfig = {
  languages: [],
  isHideCurrentLineDecorations: true,
  colorizedVariables: [],
  colorizedColors: [],
  filesToExcludes: [],
  filesToIncludes: [],
  inferedFilesToInclude: [],
  searchVariables: false,
  betaCWYS: false
};

class ColorizeContext {
  editor: TextEditor = null;
  nbLine: number = 0;
  deco: Map < number, IDecoration[] > = new Map();
  currentSelection: number[] = null;
}

const q = new Queue();

async function initDecorations(context: ColorizeContext) {
  if (!context.editor) {
    return;
  }
  let text = context.editor.document.getText();
  const fileLines: DocumentLine[] = ColorUtil.textToFileLines(text);
  let lines: DocumentLine[] = [];
  if (config.betaCWYS) {
    context.editor.visibleRanges.forEach((range: Range) => {
      lines = lines.concat(fileLines.slice(range.start.line, range.end.line + 2));
    });
  } else {
    lines = fileLines;
  }
  // removeDuplicateDecorations(context);
  await VariablesManager.findVariablesDeclarations(context.editor.document.fileName, fileLines);
  let variables: LineExtraction[] = await VariablesManager.findVariables(context.editor.document.fileName, lines);
  const colors: LineExtraction[] = await ColorUtil.findColors(lines);
  generateDecorations(colors, variables, context.deco);
  return EditorManager.decorate(context.editor, context.deco, context.currentSelection);
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
        newDecorations = newDecorations.filter((_, i) => i !== exist);
      }
      newDecorations.push(deco);
    });
    m.set(line, newDecorations);
    tmp = it.next();
  }
  context.deco = m;
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
    const decoration = ColorUtil.generateDecoration(color, line);
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
  return isLanguageSupported(document.languageId) || isIncludedFile(document.fileName);
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
  getVisibleFileEditors().filter(e => e !== editor).forEach(e => {
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

// function handleChangeTextDocument(event: TextDocumentChangeEvent) {
//   if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
//     extension.editor = window.activeTextEditor;
//     q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
//     q.push((cb) => cleanDecorationList(extension, cb));
//   }
// }

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
  // workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);

  window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);

  workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
  workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
  window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);
  workspace.onDidChangeConfiguration(handleConfigurationChanged, null, context.subscriptions);

  if (config.betaCWYS) {
    NewListeners.setupEventListeners(context);
  } else {
    OldListeners.setupEventListeners(context);
  }
}
function getVisibleFileEditors(): TextEditor[]  {
  return window.visibleTextEditors.filter(editor => editor.document.uri.scheme === 'file');
}

function colorizeVisibleTextEditors() {
  extension.nbLine = 65;
  getVisibleFileEditors().forEach(editor => {
    q.push(cb => colorize(editor, cb));
  });
}

let extension: ColorizeContext;

export function activate(context: ExtensionContext) {
  extension = new ColorizeContext();
  config = getColorizeConfig();
  ColorUtil.setupColorsExtractors(config.colorizedColors);
  VariablesManager.setupVariablesExtractors(config.colorizedVariables);
  q.push(async cb => {
    try {
      if (config.searchVariables) {
        await VariablesManager.getWorkspaceVariables(config.filesToIncludes.concat(config.inferedFilesToInclude), config.filesToExcludes); // 👍
      }
      initEventListeners(context);
    } catch (error) {}
    return cb();
  });
  colorizeVisibleTextEditors();
  return extension;
}

// this method is called when your extension is deactivated
export function deactivate() {
  extension.nbLine = null;
  extension.editor = null;
  extension.deco.clear();
  extension.deco = null;
  CacheManager.clearCache();
}

export {
  canColorize,
  ColorizeContext,
  colorize,
  config,
  extension,
  q,
  updateContextDecorations,
  generateDecorations,
  removeDuplicateDecorations,
  cleanDecorationList
};
