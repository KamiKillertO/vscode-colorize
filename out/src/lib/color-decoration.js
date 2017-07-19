"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const color_util_1 = require("./color-util");
class ColorDecoration {
    constructor(color) {
        /**
         * Keep track of the TextEditorDecorationType status
         *
         * @type {boolean}
         * @public
         * @memberOf ColorDecoration
         */
        this.disposed = false;
        this.color = color;
        this._generateDecorator();
    }
    /**
     * The TextEditorDecorationType associated to the color
     *
     * @type {TextEditorDecorationType}
     * @memberOf ColorDecoration
     */
    get decoration() {
        if (this.disposed) {
            this.disposed = false;
            this._generateDecorator();
        }
        return this._decoration;
    }
    set decoration(deco) {
        this._decoration = deco;
    }
    /**
     * Disposed the TextEditorDecorationType
     * (destroy the colored background)
     *
     * @public
     * @memberOf ColorDecoration
     */
    dispose() {
        // this.color = null;
        this.decoration.dispose();
        this.disposed = true;
    }
    /**
     * Generate the decoration Range (start and end position in line)
     *
     * @param {number} line
     * @returns {Range}
     *
     * @memberOf ColorDecoration
     */
    generateRange(line) {
        return new vscode_1.Range(new vscode_1.Position(line, this.color.positionInText), new vscode_1.Position(line, this.color.positionInText + this.color.value.length));
    }
    _generateDecorator() {
        let textColor = null;
        let luminance = color_util_1.default.luminance(this.color);
        if (luminance < 0.7) {
            textColor = '#fff';
        }
        else {
            textColor = '#000';
        }
        let backgroundDecorationType = vscode_1.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: this.color.toRgbString(),
            backgroundColor: this.color.toRgbString(),
            color: textColor
        });
        this.decoration = backgroundDecorationType;
    }
}
exports.default = ColorDecoration;
//# sourceMappingURL=color-decoration.js.map