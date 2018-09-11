import ColorExtractor, { IColorStrategy } from '../color-extractor';
import Color from '../color';
import { LineExtraction, DocumentLine } from '../../util/color-util';
import { DOT_VALUE, ALPHA, EOL } from '../../util/regexp';

const R_RED = `(?:\\d{1,3}${DOT_VALUE}?|${DOT_VALUE})`;
const R_GREEN = R_RED;
const R_BLUE = R_RED;

export const REGEXP = new RegExp(`((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`, 'gi');
export const REGEXP_ONE = new RegExp(`^((?:rgb\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*\\))|(?:rgba\\(\\s*${R_RED}\\s*,\\s*${R_GREEN}\\s*,\\s*${R_BLUE}\\s*,\\s*${ALPHA}\\s*\\)))${EOL}`, 'i');

class RgbExtractor implements IColorStrategy {
  public name: string = 'RGB';

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
          colors.push(new Color(match[1], match.index, this.extractRGBAValue(match[1])));
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
        return new Color(match[1], match.index, this.extractRGBAValue(match[1]));
      }
    }
    return null;
  }
}

ColorExtractor.registerStrategy(new RgbExtractor());
export default RgbExtractor;
