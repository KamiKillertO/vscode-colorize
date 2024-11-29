import type { IColor } from './color';
import type { LineExtraction, DocumentLine } from '../util/color-util';
import { flattenLineExtractionsFlatten } from '../util/color-util';
import type { IStrategy } from '../extractor-mixin';
import { Extractor } from '../extractor-mixin';

export interface IColorStrategy extends IStrategy {
  extractColors(fileLines: DocumentLine[]): Promise<LineExtraction[]>;
  extractColor(text: string): IColor | null;
}

class ColorExtractor extends Extractor {
  public async extract(fileLines: DocumentLine[]) {
    const colors = await Promise.all(
      this.enabledStrategies.map((strategy) =>
        (<IColorStrategy>strategy).extractColors(fileLines),
      ),
    );
    return flattenLineExtractionsFlatten(colors); // should regroup per lines?
  }

  public extractOneColor(text: string) {
    const colors = this.enabledStrategies.map((strategy) =>
      (<IColorStrategy>strategy).extractColor(text),
    );

    return colors.find((color) => color !== null);
  }
}

const instance = new ColorExtractor();
export default instance;
