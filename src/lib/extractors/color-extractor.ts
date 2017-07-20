import Color from './../color';

export interface IColorExtractor {
  name: string;
  extractColors(text: string): Promise < Color[] >;
  extractColor(text: string): Color;
}

const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

class ColorExtractor {
  public extractors: IColorExtractor[];
  constructor() {
    this.extractors = [];
  }
  public registerExtractor(extractor: IColorExtractor) {
    if (!this.has(extractor)) {
      this.extractors.push(extractor);
    }
  }
  public has(extractor: string | IColorExtractor): boolean {
    if (typeof extractor === 'string') {
      return !!this.extractors.find(_ => _.name === extractor);
    }
    return !!this.extractors.find(_ => _.name === extractor.name);
  }
  public async extract(text: string): Promise < Color[] > {
    const colors = await Promise.all(this.extractors.map(extractor => extractor.extractColors(text)));
    return flatten(colors);
  }
  public extractOneColor(text: string): Color {
    let colors = this.extractors.map(extractor => extractor.extractColor(text));
    return colors.find(color => color !== null);
  }
}
const instance = new ColorExtractor();
export default instance;
