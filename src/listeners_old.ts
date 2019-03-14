'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  workspace,
  ExtensionContext,
  TextDocumentChangeEvent,
  TextDocumentContentChangeEvent,
} from 'vscode';
import Variable from './lib/variables/variable';
import ColorUtil, { IDecoration, DocumentLine, LineExtraction } from './lib/util/color-util';
import VariablesManager from './lib/variables/variables-manager';
import EditorManager from './lib/editor-manager';
import { mapKeysToArray } from './lib/util/array';
import VariableDecoration from './lib/variables/variable-decoration';
import { mutEditedLIne } from './lib/util/mut-edited-line';
import { extension, q, ColorizeContext, updateContextDecorations, generateDecorations, removeDuplicateDecorations, cleanDecorationList } from './extension';

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
      const decos: IDecoration[] = decorations.get(position.newPosition).concat(context.deco.get(position.oldPosition));
      decos.forEach(deco => deco.generateRange(position.newPosition));
      return decorations.set(position.newPosition, decos);
    }
    const decos: IDecoration[] = context.deco.get(position.oldPosition);
    decos.forEach(deco => deco.generateRange(position.newPosition));
    return decorations.set(position.newPosition, context.deco.get(position.oldPosition));
  }, new Map());
  return editedLine;
}

function updateDecorations(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb: Function) {
  let diffLine = context.editor.document.lineCount - context.nbLine;
  if (diffLine !== 0) {
    editedLine = handleLineDiff(editedLine, context, diffLine);
    context.nbLine = context.editor.document.lineCount;
  }
  checkDecorationForUpdate(editedLine, context, cb);
}

function disposeDecorationsForEditedLines(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext) {
  editedLine.map(({range}: TextDocumentContentChangeEvent) => {
    const line = range.start.line;
    if (context.deco.has(line)) {
      context.deco.get(line).forEach(decoration => {
        decoration.dispose();
      });
    }
  });
}

function getTextForEditedLines(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext): DocumentLine[] {
  const text = context.editor.document.getText().split(/\n/);
  return editedLine.map(({range: {start: { line }}}: TextDocumentContentChangeEvent) => Object({line, text: text[line]}));
}


async function checkDecorationForUpdate(editedLine: TextDocumentContentChangeEvent[], context: ColorizeContext, cb) {

  disposeDecorationsForEditedLines(editedLine, context);
  const fileLines: DocumentLine[] = getTextForEditedLines(editedLine, context);

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

function handleChangeTextDocument(event: TextDocumentChangeEvent) {
  if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
    extension.editor = window.activeTextEditor;
    q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    q.push((cb) => cleanDecorationList(extension, cb));
  }
}

function setupEventListeners(context: ExtensionContext) {
  // window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);
  workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
}

export default { setupEventListeners };
export { handleLineDiff, disposeDecorationsForEditedLines };
