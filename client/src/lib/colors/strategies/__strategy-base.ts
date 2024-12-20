import type Color from '../color';
import type { IColorStrategy } from '../color-extractor';
import type { DocumentLine } from '../../util/color-util';

type RegexpResultExtractor = (match: RegExpExecArray) => Color | null;

export default class ColorStrategy implements IColorStrategy {
  constructor(
    public name: string,
    private REGEXP: RegExp,
    private REGEXP_ONE: RegExp,
    private colorFromRegexp: RegexpResultExtractor,
  ) {}

  extractColors(fileLines: DocumentLine[]) {
    return Promise.resolve(
      fileLines.map(({ line, text }) => {
        let match = null;
        const colors: Color[] = [];

        while ((match = this.REGEXP.exec(text)) !== null) {
          try {
            const color = this.colorFromRegexp(match);
            if (color) {
              colors.push(color);
            }
          } catch (error) {
            console.error(
              `Color extractor ${this.name}: Failed to extract color with following error.`,
            );
            console.error(error);
          }
        }
        return {
          line,
          colors,
        };
      }),
    );
  }
  extractColor(text: string) {
    const match = this.REGEXP_ONE.exec(text);
    if (match) {
      return this.colorFromRegexp(match);
    }

    return null;
  }
}
