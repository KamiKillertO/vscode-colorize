'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  workspace,
  ExtensionContext,
  extensions,
  TextEditor,
  Range,
  TextDocument,
  Position,
  TextDocumentChangeEvent,
  TextDocumentContentChangeEvent,
  TextEditorSelectionChangeEvent,
  Selection,
  WorkspaceConfiguration,
  Extension,
  commands
} from 'vscode';
import Variable from './lib/variables/variable';
import ColorUtil, { IDecoration, DocumentLine, LineExtraction } from './lib/util/color-util';
import Queue from './lib/queue';
import VariablesManager from './lib/variables/variables-manager';
import CacheManager from './lib/cache-manager';
import EditorManager from './lib/editor-manager';
import { flatten, unique } from './lib/util/array';
import * as globToRegexp from 'glob-to-regexp';

interface ColorizeConfig {
  languages: string[];
  filesExtensions: RegExp[];
  isHideCurrentLineDecorations: boolean;
  colorizedVariables: string[];
  colorizedColors: string[];
  filesToExcludes: string[];
  filesToIncludes: string[];
  inferedFilesToInclude: string[];
  searchVariables: boolean;
}
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

// Check if two arrays are equals
function arrayEquals(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i in arr1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
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

function disposeAllVariablesUseDecorations(context: ColorizeContext) {
  const lines: DocumentLine[] = ColorUtil.textToFileLines(context.editor.document.getText());
  lines.forEach(({line}) => {
    if (context.deco.has(line)) {
      context.deco.get(line).forEach(decoration => {
         // @ts-ignore
        if (decoration.variable) {
          decoration.dispose();
        }
      });
    }
  });
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
    disposeAllVariablesUseDecorations(context);
    await VariablesManager.findVariablesDeclarations(context.editor.document.fileName, lines);
    variables = await VariablesManager.findVariables(context.editor.document.fileName, lines);
    const colors: LineExtraction[] = await ColorUtil.findColors(fileLines, context.editor.document.fileName);

    const decorations = generateDecorations(colors, variables, new Map());

    EditorManager.decorate(context.editor, decorations, context.currentSelection);
    updateContextDecorations(decorations, context);
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
  disposeAllVariablesUseDecorations(context);
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
  const newConfig = readConfiguration();
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

function inferFilesToInclude(languagesConfig, filesExtensionsConfig) {
  let ext: Extension<any>[] = extensions.all;
  let filesExtensions = [];

  ext.forEach(extension => {
    if (extension.packageJSON && extension.packageJSON.contributes && extension.packageJSON.contributes.languages) {
      extension.packageJSON.contributes.languages.forEach(language => {
        if (languagesConfig.indexOf(language.id) !== -1) {
          filesExtensions = filesExtensions.concat(language.extensions);
        }
      });
    }
  });
  filesExtensions = flatten(filesExtensions); // get all languages with their files extensions ^^. Now need to filter with the one set in config
  filesExtensions = filesExtensions.concat(filesExtensionsConfig);
  return unique(filesExtensions);
}

async function displayVariablesSearchMessage() {
  const config = workspace.getConfiguration('colorize');
  const ignoreMessage = config.get('ignore_search_variables_info');
  const searchVariables = config.get('enable_search_variables');
  if (ignoreMessage === false && searchVariables === true) {
    // const updateSetting = 'Update setting';
    const neverShowAgain = 'Don\'t Show Again';
    const choice = await window.showWarningMessage('You\'re experiencing some slowing down when vscode start ? You might need to update your settings for colorize, you can learn more about it [here](https://github.com/KamiKillertO/vscode-colorize/issues/174).',
      // updateSetting,
      neverShowAgain
    );

    /* if (choice === updateSetting) {
      commands.executeCommand('workbench.action.openSettings2');
    } else */
    if (choice === neverShowAgain) {
      await config.update('ignore_search_variables_info', true, true);
    }
  }
}

async function displayFilesExtensionsDeprecationWarning(filesExtensionsConfig: string[]) {
  const config = workspace.getConfiguration('colorize');
  const ignoreWarning = config.get('ignore_files_extensions_deprecation');

  if (filesExtensionsConfig.length > 0 && ignoreWarning === false) {

    const updateSetting = 'Update setting';
    const neverShowAgain = 'Don\'t Show Again';
    const choice = await window.showWarningMessage('You\'re using the `colorize.files_extensions` settings. This settings as been deprecated in favor of `colorize.include`',
      updateSetting,
      neverShowAgain
    );

    if (choice === updateSetting) {
      commands.executeCommand('workbench.action.openSettings2');
    } else if (choice === neverShowAgain) {
      await config.update('ignore_files_extensions_deprecation', true, true);
    }
  }
}

function readConfiguration(): ColorizeConfig {
  const configuration: WorkspaceConfiguration = workspace.getConfiguration('colorize');

  // remove duplicates (if duplicates)
  const colorizedVariables = Array.from(new Set(configuration.get('colorized_variables', []))); // [...new Set(array)] // works too
  const colorizedColors = Array.from(new Set(configuration.get('colorized_colors', []))); // [...new Set(array)] // works too

  const filesExtensions = configuration.get('files_extensions', []);

  displayFilesExtensionsDeprecationWarning(filesExtensions);
  displayVariablesSearchMessage();

  const languages = configuration.get('languages', []);

  const inferedFilesToInclude = inferFilesToInclude(languages, filesExtensions).map(extension => `**/*${extension}`);

  const filesToIncludes = Array.from(new Set(configuration.get('include', [])));
  const filesToExcludes = Array.from(new Set(configuration.get('exclude', [])));

  const searchVariables = configuration.get('enable_search_variables', false);

  return {
    languages,
    filesExtensions: filesExtensions.map(ext => RegExp(`\\${ext}$`)),
    isHideCurrentLineDecorations: configuration.get('hide_current_line_decorations'),
    colorizedColors,
    colorizedVariables,
    filesToIncludes,
    filesToExcludes,
    inferedFilesToInclude,
    searchVariables
  };
}

function colorizeVisibleTextEditors() {
  window.visibleTextEditors.forEach(editor => {
    q.push(cb => colorize(editor, cb));
  });
}

export function activate(context: ExtensionContext) {
  config = readConfiguration();
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

export { canColorize };
