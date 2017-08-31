import Color, { IColor } from './color';

interface FileDeclaration {
  fileName: string;
  line: number;
}

interface Observer {
  update(args: any);
}

class Observable {
  private observers: Observer [];
  constructor () {
    this.observers = [];
  }
  registerObserver (observer: Observer) {
    this.observers.push(observer);
  }
  removerObserver (observer: Observer) {
    this.observers.slice(this.observers.indexOf(observer), 1);
  }

  notify (args: any) {
    this.observers.forEach(observer => observer.update(args));
  }
}

class Variable extends Observable implements IColor {

  public name: string;

  // public _color: Color;
  public color: Color;

  public declaration: FileDeclaration;

  public constructor(name: string, color: Color, declaration: FileDeclaration) {
    super();
    this.name = name;
    // this._color = color;
    this.color = color;
    this.declaration = declaration;
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
  public toRgbString(): string {
    return this.color.toRgbString();
  }

  public dispose() {
    this.notify(['dispose']);
  }

  public update(color: Color) {
    this.color = color;
    this.notify(['update', color]);
  }
}
export default Variable;
