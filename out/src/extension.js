'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const color_util_1 = require("./lib/color-util");
const queue_1 = require("./lib/queue");
const variables_manager_1 = require("./lib/variables/variables-manager");
const editor_manager_1 = require("./lib/editor-manager");
let config = {
    languages: null,
    filesExtensions: null
};
let extension = {
    editor: vscode_1.window.activeTextEditor,
    nbLine: 0,
    deco: null,
    currentSelection: null
};
let dirtyFilesDecorations = new Map();
let savedFilesDecorations = new Map();
const q = new queue_1.default();
// Return all map's keys in an array
function mapKeysToArray(map) {
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
function generateTextDocumentContentChange(line, text) {
    return {
        rangeLength: 0,
        text: text,
        range: new vscode_1.Range(new vscode_1.Position(line, 0), new vscode_1.Position(line, text.length))
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
function mutEditedLIne(editedLine) {
    let newEditedLine = [];
    let startLine = 0;
    let before = 0;
    editedLine.reverse();
    editedLine.forEach(line => {
        let a = line.text.match(/\n/g);
        startLine = line.range.start.line + before;
        line.text.split(/\n/).map((text, i, array) => {
            if (i === 0 && text === '' && array.length === 1) {
                startLine++;
            }
            else {
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
function handleLineRemoved(editedLine, positions) {
    editedLine.reverse();
    editedLine.forEach((line) => {
        for (let i = line.range.start.line; i <= line.range.end.line; i++) {
            variables_manager_1.default.deleteVariableInLine(extension.editor.document.fileName, i);
        }
        positions = updatePositionsDeletion(line.range, positions);
    });
    return editedLine;
}
function handleLineAdded(editedLine, position) {
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
function handleLineDiff(editedLine, context, diffLine) {
    let positions = mapKeysToArray(context.deco).map(position => Object({
        oldPosition: position,
        newPosition: position
    }));
    if (diffLine < 0) {
        editedLine = handleLineRemoved(editedLine, positions);
    }
    else {
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
function updateDecorations(editedLine, context, cb) {
    let diffLine = context.editor.document.lineCount - context.nbLine;
    let positions;
    if (diffLine !== 0) {
        editedLine = handleLineDiff(editedLine, context, diffLine);
        context.nbLine = context.editor.document.lineCount;
    }
    checkDecorationForUpdate(editedLine, context, cb);
}
function checkDecorationForUpdate(editedLine, context, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = new Map();
        yield Promise.all(editedLine.map(({ range }) => __awaiter(this, void 0, void 0, function* () {
            if (context.deco.has(range.start.line)) {
                context.deco.get(range.start.line).forEach(decoration => {
                    decoration.dispose();
                });
            }
            context.deco.set(range.start.line, []);
            // lineAt raise an exception if line does not exist
            try {
                const text = context.editor.document.lineAt(range.start.line).text;
                yield variables_manager_1.default.findVariablesDeclarations(context.editor.document.fileName, text, range.start.line);
                const colors = yield color_util_1.default.findColors(text, context.editor.document.fileName);
                const variables = yield variables_manager_1.default.findVariables(text, context.editor.document.fileName);
                return generateDecorations(colors, variables, range.start.line, m);
            }
            catch (e) {
                return context.deco;
            }
        })));
        editor_manager_1.default.decorate(context.editor, m, context.currentSelection);
        let it = m.entries();
        let tmp = it.next();
        while (!tmp.done) {
            let line = tmp.value[0];
            if (context.deco.has(line)) {
                context.deco.set(line, context.deco.get(line).concat(m.get(line)));
            }
            else {
                context.deco.set(line, m.get(line));
            }
            tmp = it.next();
        }
        cb();
    });
}
function initDecorations(context, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.editor) {
            return cb();
        }
        let text = context.editor.document.getText();
        let n = context.editor.document.lineCount;
        const colors = yield Promise.all(context.editor.document.getText()
            .split(/\n/)
            .map((text, index) => Object({
            'text': text,
            'line': index
        }))
            .map((line) => __awaiter(this, void 0, void 0, function* () {
            const colors = yield color_util_1.default.findColors(line.text, context.editor.document.fileName);
            const variables = yield variables_manager_1.default.findVariables(line.text, context.editor.document.fileName);
            // const variables = [];
            return generateDecorations(colors, variables, line.line, context.deco);
        })));
        editor_manager_1.default.decorate(context.editor, context.deco, context.currentSelection);
        cb();
    });
}
function updateDecorationMap(map, line, decoration) {
    if (map.has(line)) {
        map.set(line, map.get(line).concat([decoration]));
    }
    else {
        map.set(line, [decoration]);
    }
}
function generateDecorations(colors, variables, line, decorations) {
    colors.forEach((color) => {
        const decoration = color_util_1.default.generateDecoration(color);
        updateDecorationMap(decorations, line, decoration);
    });
    variables.forEach((variable) => {
        const decoration = variables_manager_1.default.generateDecoration(variable);
        updateDecorationMap(decorations, line, decoration);
    });
    return decorations;
}
/**
 * Check if COLORIZE support a language
 *
 * @param {string} languageId A valid languageId
 * @returns {boolean}
 */
function isLanguageSupported(languageId) {
    return config.languages.indexOf(languageId) !== -1;
}
/**
 * Check if COLORIZE support a file extension
 *
 * @param {string} fileName A valid file extension
 * @returns {boolean}
 */
function isFileExtensionSupported(fileName) {
    return config.filesExtensions.find((ext) => ext.test(fileName));
}
/**
 * Check if a file can be colorized by COLORIZE
 *
 * @param {TextDocument} document The document to test
 * @returns {boolean}
 */
function canColorize(document) {
    return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName);
}
exports.canColorize = canColorize;
/**
 * Return the saved decorations for a document or return null if the file has never been opened before.
 *
 * @param {TextEditor} editor
 * @returns {(Map<number, IDecoration[]> | null)}
 */
function getSavedDecorations(document) {
    if (!document.isDirty && savedFilesDecorations.has(document.fileName)) {
        return savedFilesDecorations.get(document.fileName);
    }
    if (dirtyFilesDecorations.has(document.fileName)) {
        return dirtyFilesDecorations.get(document.fileName);
    }
    return null;
}
/**
 * Save a file decorations
 *
 * @param {TextDocument} document
 * @param {Map<number, IDecoration[]>} deco
 */
function saveDecorations(document, deco) {
    document.isDirty ? _saveDirtyDecoration(document.fileName, deco) : _saveSavedDecorations(document.fileName, deco);
}
function _saveDirtyDecoration(fileName, decorations) {
    return dirtyFilesDecorations.set(fileName, decorations);
}
function _saveSavedDecorations(fileName, decorations) {
    return savedFilesDecorations.set(fileName, decorations);
}
function handleTextSelectionChange(event) {
    if (event.textEditor !== extension.editor) {
        return;
    }
    // if (event.kind !== TextEditorSelectionChangeKind.Mouse || event.kind === TextEditorSelectionChangeKind.Keyboard ) { // 'command' kind is fired when click occur inside a selected zone
    // vscode issue?
    if (event.kind === undefined) {
        return;
    }
    q.push(cb => {
        if (extension.currentSelection.length !== 0) {
            extension.currentSelection.forEach(line => {
                const decorations = extension.deco.get(line);
                if (decorations !== undefined) {
                    editor_manager_1.default.decorateOneLine(extension.editor, decorations, line);
                }
            });
        }
        extension.currentSelection = [];
        event.selections.forEach((selection) => {
            let decorations = extension.deco.get(selection.active.line);
            if (decorations) {
                decorations.forEach(_ => _.dispose());
            }
        });
        extension.currentSelection = event.selections.map((selection) => selection.active.line);
        return cb();
    });
}
function handleCloseOpen(document) {
    q.push((cb) => {
        if (extension.editor && extension.editor.document.fileName === document.fileName) {
            saveDecorations(document, extension.deco);
            return cb();
        }
        return cb();
    });
}
function colorize(editor, cb) {
    if (!editor) {
        return cb();
    }
    if (!canColorize(editor.document)) {
        return cb();
    }
    extension.editor = editor;
    extension.currentSelection = [];
    const deco = getSavedDecorations(editor.document);
    if (deco) {
        extension.deco = deco;
        extension.nbLine = editor.document.lineCount;
        editor_manager_1.default.decorate(extension.editor, extension.deco, extension.currentSelection);
        return cb();
    }
    extension.deco = new Map();
    extension.nbLine = editor.document.lineCount;
    return initDecorations(extension, () => {
        saveDecorations(extension.editor.document, extension.deco);
        return cb();
    });
}
function handleChangeActiveTextEditor(editor) {
    if (extension.editor !== undefined && extension.editor !== null) {
        saveDecorations(extension.editor.document, extension.deco);
    }
    vscode_1.window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
        q.push(cb => colorize(e, cb));
    });
    q.push(cb => colorize(editor, cb));
}
function handleChangeTextDocument(event) {
    if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
        extension.editor = vscode_1.window.activeTextEditor;
        q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
    }
}
function activate(context) {
    const configuration = vscode_1.workspace.getConfiguration('colorize');
    config.languages = configuration.get('languages', []);
    config.filesExtensions = configuration.get('files_extensions', []).map(ext => RegExp(`\\${ext}$`));
    if (configuration.get('hide_current_line_decorations') === true) {
        vscode_1.window.onDidChangeTextEditorSelection(handleTextSelectionChange, null, context.subscriptions);
    }
    vscode_1.workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);
    vscode_1.workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
    if (configuration.get('activate_variables_support_beta') === true) {
        // q.push(cb => seekForColorVariables(cb));
        q.push(cb => variables_manager_1.default.getWorkspaceVariables().then(cb));
    }
    vscode_1.window.visibleTextEditors.forEach(editor => {
        q.push(cb => colorize(editor, cb));
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    extension.nbLine = null;
    extension.editor = null;
    extension.deco.clear();
    extension.deco = null;
    dirtyFilesDecorations.clear();
    dirtyFilesDecorations = null;
    savedFilesDecorations.clear();
    savedFilesDecorations = null;
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map