export interface IStrategy {
  name: string;
}
export class Extractor {
  public strategies: IStrategy[];
  protected enabledStrategies: IStrategy[] = [];

  constructor() {
    this.strategies = [];
  }

  public enableStrategies(strategiesToEnable: string[]) {
    this.enabledStrategies = this.strategies.filter((strategy) => {
      if (strategiesToEnable.find((_) => _ === strategy.name)) {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const constructor: any = strategy.constructor;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return new constructor();
      }
    });
  }

  public registerStrategy(strategy: IStrategy) {
    if (!this.has(strategy)) {
      this.strategies.push(strategy);
    }
  }

  public has(strategy: string | IStrategy) {
    if (typeof strategy === 'string') {
      return this.strategies.some((_) => _.name === strategy);
    }
    return this.strategies.some((_) => _.name === strategy.name);
  }

  public get(strategy: string | IStrategy) {
    if (this.has(strategy) === false) {
      return undefined;
    }

    return this.strategies.find((_) => _.name === strategy);
  }
}
