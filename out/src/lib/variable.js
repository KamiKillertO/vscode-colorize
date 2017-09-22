"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Observable {
    constructor() {
        this.observers = [];
    }
    registerObserver(observer) {
        this.observers.push(observer);
    }
    removerObserver(observer) {
        this.observers.slice(this.observers.indexOf(observer), 1);
    }
    notify(args) {
        this.observers.forEach(observer => observer.update(args));
    }
}
class Variable extends Observable {
    constructor(name, color, declaration) {
        super();
        this.name = name;
        // this._color = color;
        this.color = color;
        this.declaration = declaration;
    }
    updateColor(c) {
        this.color = c;
        this.notify(c);
    }
    // public get color() {
    //   return this._color;
    // }
    // public set color(c: Color) {
    //   this._color = c;
    //   this.notify(c);
    // }
    /**
     * Generate the color string rgb representation
     * example :
     *  #fff => rgb(255, 255, 255)
     *  rgba(1, 34, 12, .1) => rgb(1, 34, 12)
     *
     * @returns {string}
     * @public
     * @memberOf Color
     */
    toRgbString() {
        return this.color.toRgbString();
    }
    dispose() {
        this.notify(['dispose']);
    }
    update(color) {
        this.color = color;
        this.notify(['update', color]);
    }
}
exports.default = Variable;
//# sourceMappingURL=variable.js.map