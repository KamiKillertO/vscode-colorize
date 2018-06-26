import Color, { IColor } from '../colors/color';

interface FileDeclaration {
  fileName: string;
  line: number;
}

class Variable implements IColor {

  public name: string;

  public color: Color;

  public declaration: FileDeclaration;

  public id: number;

  public constructor(name: string, color: Color, declaration: FileDeclaration) {
    this.name = name;
    this.color = color;
    this.declaration = declaration;
  }

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

  public update(color: Color) {
    this.color.rgb = color.rgb;
  }
}
export default Variable;
