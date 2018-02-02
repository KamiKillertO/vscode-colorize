import ColorExtractor, { IColorExtractor } from '../color-extractor';
import Color from '../color';
import { LineExtraction, DocumentLine } from '../../color-util';

export const REGEXP = /((?:rgb\((?:\d{1,3}\s*,\s*){2}\d{1,3}\))|(?:rgba\((?:\d{1,3}\s*,\s*){3}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/gi;
export const REGEXP_ONE = /^((?:rgb\((?:\d{1,3}\s*,\s*){2}\d{1,3}\))|(?:rgba\((?:\d{1,3}\s*,\s*){3}(?:[0-1]|1\.0|[0](?:\.\d+){0,1}|(?:\.\d+))\)))(?:$|"|'|,| |;|\)|\r|\n)/i;

class RgbExtractor implements IColorExtractor {
  public name: string = 'RGB_EXTRACTOR';

  private extractRGBAValue(value): number[] {
    let rgba =  value.replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
    return rgba.slice(0, 3);
  }
  public async extractColors(fileLines: DocumentLine[]): Promise < LineExtraction[] > {
    return fileLines.map(({line, text}) => {
      let match = null;
      let colors: Color[] = [];
      // Get rgb "like" colors
      while ((match = REGEXP.exec(text)) !== null) {
        let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
        // Check if it's a valid rgb(a) color
        if (rgba.slice(0, 3).every(c => c <= 255)) {
          colors.push(new Color(match[1], match.index, 1, this.extractRGBAValue(match[1])));
        }
      }
      return {
        line,
        colors
      };
    });
  }
  public extractColor(text: string): Color {
    let match: RegExpMatchArray = text.match(REGEXP_ONE);
    if (match) {
      let rgba = match[1].replace(/rgb(a){0,1}\(/, '').replace(/\)/, '').split(/,/gi).map(c => parseFloat(c));
      // Check if it's a valid rgb(a) color
      if (rgba.slice(0, 3).every(c => c <= 255)) {
        return new Color(match[1], match.index, 1, this.extractRGBAValue(match[1]));
      }
    }
    return null;
  }
}

ColorExtractor.registerExtractor(new RgbExtractor());
export default RgbExtractor;
