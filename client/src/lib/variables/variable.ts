import type { IColor } from '../colors/color';
import type Color from '../colors/color';

interface VariableLocation {
  fileName: string;
  line: number;
  position?: number;
}

class Variable implements IColor {
  public name: string;

  public value: string;

  public color: Color;

  public location: VariableLocation;

  public type: string;

  public constructor(
    name: string,
    value: string,
    color: Color,
    location: VariableLocation,
    type: string,
  ) {
    this.name = name;
    this.value = value;
    this.color = color;
    this.location = location;
    this.type = type;
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
  public toRgbString() {
    return this.color.toRgbString();
  }

  public update(color: Color) {
    this.color = color;
  }
}
export default Variable;

export { VariableLocation };
