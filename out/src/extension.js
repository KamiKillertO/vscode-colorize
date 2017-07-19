'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const color_util_1 = require("./lib/color-util");
const color_decoration_1 = require("./lib/color-decoration");
const queue_1 = require("./lib/queue");
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
        positions = updatePositionsDeletion(line.range, positions);
    });
    return editedLine;
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
        }
        else {
            newDeco.set(position.newPosition, context.deco.get(position.oldPosition));
        }
    });
    context.deco = newDeco;
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
    let m = new Map();
    Promise.all(editedLine.map(({ range }) => {
        if (context.deco.has(range.start.line)) {
            context.deco.get(range.start.line).forEach(decoration => {
                decoration.dispose();
            });
        }
        context.deco.set(range.start.line, []);
        // lineAt raise an exception if line does not exist
        try {
            return color_util_1.default.findColors(context.editor.document.lineAt(range.start.line).text)
                .then(colors => generateDecorations(colors, range.start.line, m));
        }
        catch (e) {
            return context.deco;
        }
    })).then((decorations) => {
        decorateEditor(m, context.editor, context.currentSelection);
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
    })
        .then(cb);
}
function initDecorations(context, cb) {
    if (!context.editor) {
        return cb();
    }
    let text = context.editor.document.getText();
    let n = context.editor.document.lineCount;
    Promise.all(context.editor.document.getText()
        .split(/\n/)
        .map((text, index) => Object({
        'text': text,
        'line': index
    }))
        .map(line => color_util_1.default.findColors(line.text)
        .then(colors => generateDecorations(colors, line.line, context.deco))))
        .then(() => decorateEditor(context.deco, context.editor, context.currentSelection))
        .then(cb);
}
// Mut context ><
function generateDecorations(colors, line, decorations) {
    colors.forEach((color) => {
        let startPos = new vscode_1.Position(line, color.positionInText);
        let endPos = new vscode_1.Position(line, color.positionInText + color.value.length);
        if (decorations.has(line)) {
            decorations.set(line, decorations.get(line).concat([new color_decoration_1.default(color)]));
        }
        else {
            decorations.set(line, [new color_decoration_1.default(color)]);
        }
    });
    return decorations;
}
// Run through all decoration to generate editor's decorations
function decorateEditor(decorations, editor, currentSelection) {
    let it = decorations.entries();
    let tmp = it.next();
    while (!tmp.done) {
        let line = tmp.value[0];
        if (line !== currentSelection) {
            decorateLine(editor, tmp.value[1], line);
        }
        tmp = it.next();
    }
    return;
}
// Decorate editor's decorations for one line
function decorateLine(editor, decorations, line) {
    decorations.forEach(decoration => editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]));
}
function isLanguageSupported(languageId) {
    return config.languages.indexOf(languageId) !== -1;
}
function isFileExtensionSupported(fileName) {
    return config.filesExtensions.find(ext => ext.test(fileName));
}
function isSupported(document) {
    return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName);
}
function colorize(editor, cb) {
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
        decorateEditor(extension.deco, extension.editor, extension.currentSelection);
        return cb();
    }
    extension.deco = new Map();
    extension.nbLine = editor.document.lineCount;
    return initDecorations(extension, () => {
        saveDecorations(extension.editor.document, extension.deco);
        return cb();
    });
}
function getDecorations(editor) {
    if (!editor.document.isDirty && savedFilesDecorations.has(editor.document.fileName)) {
        return savedFilesDecorations.get(editor.document.fileName);
    }
    if (dirtyFilesDecorations.has(editor.document.fileName)) {
        return dirtyFilesDecorations.get(editor.document.fileName);
    }
    return null;
}
function seekForColorVariables(cb) {
    const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
    statusBar.text = 'Fetching files...';
    statusBar.show();
    console.time('Start variables extraction');
    console.time('Start files search');
    // not so bad
    vscode_1.workspace.findFiles('{**/*.css,**/*.sass,**/*.scss,**/*.less,**/*.pcss,**/*.sss,**/*.stylus,**/*.styl}', '{**/.git,**/.svn,**/.hg,**/CVS,**/.DS_Store,**/.git,**/node_modules,**/bower_components}').then((files) => {
        console.timeEnd('Start files search');
        statusBar.text = `Found ${files.length} files`;
        console.time('Open documents');
        Promise.all(files.map((f) => vscode_1.workspace.openTextDocument(f.path).then(d => d.getText()))).then(res => {
            console.timeEnd('Open documents');
            console.time('Find color variables');
            return color_util_1.default.findColorVariables(res.join(' '));
        })
            .then(vars => {
            statusBar.text = `Found ${vars.size} variables`;
            console.timeEnd('Find color variables');
            console.timeEnd('Start variables extraction');
            return cb();
        });
    }, (reason) => cb());
}
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
    if (event.kind !== undefined) {
        q.push(cb => {
            if (extension.currentSelection !== null && extension.deco.get(extension.currentSelection) !== undefined) {
                decorateLine(extension.editor, extension.deco.get(extension.currentSelection), extension.currentSelection);
            }
            extension.currentSelection = null;
            event.selections.forEach((selection) => {
                let decorations = extension.deco.get(selection.active.line);
                if (decorations) {
                    extension.currentSelection = selection.active.line;
                    decorations.forEach(_ => _.dispose());
                }
            });
            return cb();
        });
    }
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
function activate(context) {
    const configuration = vscode_1.workspace.getConfiguration('colorize');
    config.languages = configuration.get('languages', []);
    config.filesExtensions = configuration.get('files_extensions', []).map(ext => RegExp(`\\${ext}$`));
    if (configuration.get('hide_current_line_decorations') === true) {
        vscode_1.window.onDidChangeTextEditorSelection(handleTextSelectionChange, null, context.subscriptions);
    }
    vscode_1.workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.window.onDidChangeActiveTextEditor(editor => {
        if (extension.editor !== undefined && extension.editor !== null) {
            saveDecorations(extension.editor.document, extension.deco);
        }
        vscode_1.window.visibleTextEditors.filter(e => e !== editor).forEach(e => {
            q.push(cb => colorize(e, cb));
        });
        q.push(cb => colorize(editor, cb));
    }, null, context.subscriptions);
    vscode_1.workspace.onDidChangeTextDocument((event) => {
        if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
            extension.editor = vscode_1.window.activeTextEditor;
            q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
        }
    }, null, context.subscriptions);
    if (configuration.get('activate_variables_beta') === true) {
        q.push(cb => seekForColorVariables(cb));
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