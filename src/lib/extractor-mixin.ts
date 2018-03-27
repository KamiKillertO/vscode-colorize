export interface IStrategy {
  name: string;
}
export class Extractor {
  public strategies: IStrategy[];
  constructor() {
    this.strategies = [];
  }
  public registerStrategy(strategy: IStrategy) {
    if (!this.has(strategy)) {
      this.strategies.push(strategy);
    }
  }
  public has(strategy: string | IStrategy): boolean {
    if (typeof strategy === 'string') {
      return this.strategies.some(_ => _.name === strategy);
    }
    return this.strategies.some(_ => _.name === strategy.name);
  }

  public get(strategy: string | IStrategy): IStrategy {
    if (this.has(strategy) === false) {
      return null;
    }
    return this.strategies.find(_ => _.name === strategy);
  }
}

// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;

// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//       public extractors: IStrategy[];
//       constructor(...args: any[]) {
//         super(...args);
//         this.extractors = [];
//       }
//       public registerExtractor(extractor: IStrategy) {
//         if (!this.has(extractor)) {
//           this.extractors.push(extractor);
//         }
//       }
//       public has(extractor: string | IStrategy): boolean {
//         if (typeof extractor === 'string') {
//           return this.extractors.some(_ => _.name === extractor);
//         }
//         return this.extractors.some(_ => _.name === extractor.name);
//       }

//       public get(extractor: string | IStrategy): IStrategy {
//         if (this.has(extractor) === false) {
//           return null;
//         }
//         return this.extractors.find(_ => _.name === extractor);
//       }
//   };
// }
