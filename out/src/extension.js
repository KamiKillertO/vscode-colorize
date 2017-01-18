'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const color_regex_1 = require("./color-regex");
const color_util_1 = require("./color-util");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let decorations = [];
let deco = new Map();
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "colorize" is now active!');
    let timeout = null;
    let editor = vscode_1.window.activeTextEditor;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    function updateDecorations() {
        // Create an issue on vscode github
        // "Decoration should not be expandeable" or something like this
        // if (decoration)
        // 	decoration.dispose()
        // let startPos = new Position(1, 1);
        // let endPos = new Position(1, 5);
        // let range = new Range(startPos, endPos);
        // decoration = window.createTextEditorDecorationType({
        // 	borderWidth: "1px",
        // 	borderStyle: "solid",
        // 	borderColor: "#FFF",
        // 	backgroundColor: "#FFF",
        // 	color: "#000"
        // });
        // editor.setDecorations(decoration, [range]);
        if (!editor) {
            return;
        }
        // debugger;
        let disposed = decorations.filter(decoration => {
            decoration.checkDecoration(editor);
            return decoration.disposed;
        });
        let text = vscode_1.window.activeTextEditor.document.getText();
        let match = null;
        let start = 0;
        while (match = color_regex_1.HEXA_COLOR.exec(text)) {
            let startPos = editor.document.positionAt(start + match.index);
            let endPos = editor.document.positionAt(start + match.index + match[1].length);
            start += match.index + match[1].length;
            text = text.substr(match.index + match[1].length);
            let alreadyIn = decorations.find(decoration => decoration.textPosition.start.isEqual(startPos) && decoration.textPosition.end.isEqual(endPos));
            if (alreadyIn) {
                continue;
            }
            let range = new vscode_1.Range(startPos, endPos);
            let decoration = generateDecorator(match[1]);
            decorations.push(new ColorDecoration(range, decoration, color_regex_1.HEXA_COLOR, match[1]));
            editor.setDecorations(decoration, [range]);
        }
    }
    if (editor) {
        triggerUpdateDecorations();
    }
    vscode_1.window.onDidChangeActiveTextEditor(newEditor => {
        editor = newEditor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode_1.workspace.onDidChangeTextDocument(event => {
        if (editor && event.document === editor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
function generateDecorator(color) {
    let textColor = null;
    let luminance = color_util_1.default.luminance(color);
    if (luminance < 0.7) {
        textColor = '#fff';
    }
    else {
        textColor = '#000';
    }
    let backgroundDecorationType = vscode_1.window.createTextEditorDecorationType({
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: color,
        backgroundColor: color,
        color: textColor
    });
    return backgroundDecorationType;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class ColorDecoration {
    constructor(textPosition, decoration, matcher, match) {
        this.disposed = false;
        this.textPosition = textPosition;
        this._decoration = decoration;
        this._matcher = matcher;
        this._match = match;
    }
    checkDecoration(editor) {
        let character_after = editor.document.lineAt(this.textPosition.start.line).text.substring(this.textPosition.end.character, this.textPosition.end.character + 1);
        let text = editor.document.lineAt(this.textPosition.start.line).text.substring(this.textPosition.start.character, this.textPosition.end.character + 1);
        if (!this._matcher.test(text) || character_after === "") {
            this._decoration.dispose();
            this.disposed = true;
            return;
        }
        if (text === this._match) {
            return;
        }
        this._match = text;
        this._updateDecoration(editor);
        return;
    }
    _updateDecoration(editor) {
        this._decoration.dispose();
        let decoration = generateDecorator(this._match);
        this._decoration = decoration;
        editor.setDecorations(this._decoration, [{
                range: this.textPosition
            }]);
    }
    dispose() {
        this._decoration.dispose();
    }
}
//# sourceMappingURL=extension.js.map