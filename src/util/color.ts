class Color {
  public value: string;
  public rgb: number[];
  public alpha: number;
  public positionInText: number;

  public constructor(value: string, positionInText: number = 0, alpha: number = 1, rgb: number[]) {
    this.value = value;
    this.positionInText = positionInText;
    this.alpha = alpha;
    this.rgb = rgb;
  }

  public toRgbString(): string {
    return `rgb(${this.rgb.join(',')})`;
  }
}
export default Color;
