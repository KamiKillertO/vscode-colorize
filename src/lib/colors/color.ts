interface IColor {
  toRgbString(): string;
}

class Color implements IColor {
  /**
   * The extracted text corresponding to the color
   * example: #fff, #fffff, rgba(0,0,0,0.1)...
   *
   * @type {string} value
   * @public
   * @memberOf Color
   */
  public value: string;
  /**
   * The color rgb value
   *
   * @type {number[]} rgb
   * @public
   * @memberOf Color
   */
  public rgb: number[];
  /**
   *  The color alpha, the value should be between 0 and 1
   *
   * @type {number} alpha
   * @public
   * @memberOf Color
   */
  public alpha: number;
  /**
   * The position inside a line of the extracted text (see color.value)
   *
   * @type {number} positionInText
   * @public
   * @memberOf Color
   */
  public positionInText: number;
  /**
   * Creates an instance of Color.
   *
   * @param {string} value
   * @param {number} [positionInText=0]
   * @param {number} [alpha=1]
   * @param {number[]} rgb
   *
   * @memberOf Color
   */
  public constructor(value: string, positionInText: number = 0, rgb: number[], alpha?: number) {
    this.value = value;
    this.positionInText = positionInText;
    this.alpha = alpha || 1;
    this.rgb = rgb;
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
    return `rgb(${this.rgb.join(', ')})`;
  }

}
export default Color;

export { IColor };
