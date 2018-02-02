import { IColor } from './color';
import { DocumentLine } from '../variables/variables-manager';

export interface IColorExtractor {
  name: string;
  extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] >;
  extractColor(text: string): IColor;
}
export interface LineExtraction {
  line: number;
  colors: IColor[];
}

const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []).filter(_ => _.colors.length !== 0);

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
      return this.extractors.some(_ => _.name === extractor);
    }
    return this.extractors.some(_ => _.name === extractor.name);
  }
  public get(extractor: string | IColorExtractor): IColorExtractor {
    if (this.has(extractor) === false) {
      return null;
    }
    return this.extractors.find(_ => _.name === extractor);
  }
  public async extract(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    const colors = await Promise.all(this.extractors.map(extractor => extractor.extractColors(fileLines)));
    return flatten(colors); // should regroup per lines?
  }
  public extractOneColor(text: string): IColor {
    let colors = this.extractors.map(extractor => extractor.extractColor(text));
    return colors.find(color => color !== null);
  }
}
const instance = new ColorExtractor();
export default instance;
