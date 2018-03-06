import { IColor } from './color';
import { LineExtraction, DocumentLine, flattenLineExtractionsFlatten } from '../color-util';

export interface IColorExtractor {
  name: string;
  extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] >;
  extractColor(text: string): IColor;
}
  public extractors: IColorExtractor[];
class ColorExtractor extends Extractor {
  public async extract(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    const colors = await Promise.all(this.extractors.map(extractor => extractor.extractColors(fileLines)));
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }
  public extractOneColor(text: string): IColor {
    let colors = this.extractors.map(extractor => extractor.extractColor(text));
    return colors.find(color => color !== null);
  }
}
const instance = new ColorExtractor();
export default instance;
