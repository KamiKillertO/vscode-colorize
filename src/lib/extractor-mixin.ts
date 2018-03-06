export interface IExtractor {
  name: string;
}
export class Extractor {
  public extractors: IExtractor[];
  constructor() {
    this.extractors = [];
  }
  public registerExtractor(extractor: IExtractor) {
    if (!this.has(extractor)) {
      this.extractors.push(extractor);
    }
  }
  public has(extractor: string | IExtractor): boolean {
    if (typeof extractor === 'string') {
      return this.extractors.some(_ => _.name === extractor);
    }
    return this.extractors.some(_ => _.name === extractor.name);
  }

  public get(extractor: string | IExtractor): IExtractor {
    if (this.has(extractor) === false) {
      return null;
    }
    return this.extractors.find(_ => _.name === extractor);
  }
}

// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;

// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//       public extractors: IExtractor[];
//       constructor(...args: any[]) {
//         super(...args);
//         this.extractors = [];
//       }
//       public registerExtractor(extractor: IExtractor) {
//         if (!this.has(extractor)) {
//           this.extractors.push(extractor);
//         }
//       }
//       public has(extractor: string | IExtractor): boolean {
//         if (typeof extractor === 'string') {
//           return this.extractors.some(_ => _.name === extractor);
//         }
//         return this.extractors.some(_ => _.name === extractor.name);
//       }

//       public get(extractor: string | IExtractor): IExtractor {
//         if (this.has(extractor) === false) {
//           return null;
//         }
//         return this.extractors.find(_ => _.name === extractor);
//       }
//   };
// }
