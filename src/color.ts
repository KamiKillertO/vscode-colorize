import ColorUtil from './color-util';

class Color {
  public model: string;
  public value: string;
  public positionInText: number;

  public constructor(model: string, value: string, positionInText: number = 0) {
    this.model = model;
    this.value = value;
    this.positionInText = positionInText;
  }
}
export default Color;
