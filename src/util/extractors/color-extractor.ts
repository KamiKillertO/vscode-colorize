import Color from './../color';

export interface IColorExtractor {
  name: string;
  extractColors(text: string): Promise < Color[] >;
};

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
  public extract(text: string): Promise < Color[] > {
    let start = Date.now();
     return Promise.all(
       this.extractors.map(extractor => extractor.extractColors(text))
     ).then(colors => {
      return flatten(colors);
    });
  }
}
const instance = new ColorExtractor();
export default instance;
