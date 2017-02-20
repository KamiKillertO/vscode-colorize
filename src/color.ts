import ColorUtil from './color-util';

class Color {
  public model: string;
  public value: string;
  public rgb: number[];
  public alpha: number;
  public positionInText: number;

  public constructor(model: string, value: string, positionInText: number = 0, rgb = null, alpha = 1) {
    this.model = model;
    this.value = value;
    this.positionInText = positionInText;
    this.alpha = alpha;
    if (rgb) {
      this.rgb = rgb;
    } else {
      this._generateRGBAValue();
    }
  }

  private _generateRGBAValue() {
    switch (this.model) {
      case 'hexa':
        let rgb: any = /#(.+)/gi.exec(this.value);
        if (rgb[1].length === 3) {
          return this.rgb = rgb[1].split('').map(_ => parseInt(_ + _, 16));
        }
        rgb = rgb[1].split('').map(_ => parseInt(_, 16));
        this.rgb = [16 * rgb[0] + rgb[1], 16 * rgb[2] + rgb[3], 16 * rgb[4] + rgb[5]];
        return this;
      case 'rgb':
        let rgba =  this.value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
        this.rgb = rgba.slice(0, 3);
        this.alpha = rgba[4] || 1;
        return this;
    }
  }

  public toRGBString(): string {
    return `rgb(${this.rgb.join(',')})`;
  }
}
export default Color;
