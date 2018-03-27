import { IColor } from './color';
import { LineExtraction, DocumentLine, flattenLineExtractionsFlatten } from '../color-util';
import { Extractor, IStrategy } from '../extractor-mixin';

export interface IColorStrategy extends IStrategy {
  extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] >;
  extractColor(text: string): IColor;
}
class ColorExtractor extends Extractor {
  public strategies: IColorStrategy[];

  public async extract(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    const colors = await Promise.all(this.strategies.map(strategy => strategy.extractColors(fileLines)));
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }
  public extractOneColor(text: string): IColor {
    let colors = this.strategies.map(strategy => strategy.extractColor(text));
    return colors.find(color => color !== null);
  }
}
const instance = new ColorExtractor();
export default instance;
