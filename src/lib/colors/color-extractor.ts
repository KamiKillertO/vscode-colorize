import { IColor } from './color';
import {
  LineExtraction,
  DocumentLine,
  flattenLineExtractionsFlatten,
} from '../util/color-util';
import { Extractor, IStrategy } from '../extractor-mixin';

export interface IColorStrategy extends IStrategy {
  extractColors(fileLines: DocumentLine[]): Promise<LineExtraction[]>;
  extractColor(text: string): IColor | null;
}
class ColorExtractor extends Extractor {
  public async extract(fileLines: DocumentLine[]): Promise<LineExtraction[]> {
    const colors = await Promise.all(
      this.enabledStrategies.map((strategy) =>
        (<IColorStrategy>strategy).extractColors(fileLines)
      )
    );
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }
  public extractOneColor(text: string): IColor | undefined {
    const colors = this.enabledStrategies.map((strategy) =>
      (<IColorStrategy>strategy).extractColor(text)
    );

    return colors.find((color) => color !== null);
  }
}
const instance = new ColorExtractor();
export default instance;
