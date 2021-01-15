import Variable from './variable';
import Color from '../colors/color';
import { dirname } from 'path';

class VariablesStore {
  private entries: Map < string, Variable[] > = new Map();

  public has(variable: string = null, fileName: string = null, line: number = null): boolean {
    const declarations = this.get(variable, fileName, line);
    return declarations && declarations.length > 0;
  }

  public get(variable: string, fileName: string = null, line: number = null): Variable[] {
    let decorations = this.entries.get(variable) || [];
    if (fileName !== null) {
      decorations = decorations.filter(_ => _.location.fileName === fileName);
    }
    if (line !== null) {
      decorations = decorations.filter(_ => _.location.line === line);
    }
    return decorations;
  }

  private __delete(variable: string, fileName: string, line: number): void {
    let decorations = this.get(variable);

    if (line !== null) {
      decorations = decorations.filter(_ => _.location.fileName !== fileName || (_.location.fileName === fileName && _.location.line !== line));
    } else if (fileName !== null) {
      decorations = decorations.filter(_ => _.location.fileName !== fileName);
    }
    this.entries.set(variable, decorations);
    return;
  }

  public delete(variable: string = null, fileName: string = null, line: number = null): void {
    if (variable !== null) {
      return this.__delete(variable, fileName, line);
    }
    const IT: IterableIterator<[string, Variable[]]> = this.entries.entries();
    let tmp: IteratorResult<[string, Variable[]]> = IT.next();
    while (tmp.done === false) {
      const varName: string = tmp.value[0];
      this.__delete(varName, fileName, line);
      tmp = IT.next();
    }
  }

  // not sure it should be here ><
  private getColor(match, fileName, line): Color {
    let color = null;
    const varName = match[1] || match[2];
    let variables: Variable[] = [].concat(this.get(varName, fileName, line));
    if (variables.length === 0) {
      variables = [].concat(this.get(varName));
    }
    if (variables.length !== 0) {
      color = new Color(varName, match.index, variables.pop().color.rgb);
    }
    return color;
  }

  public addEntry(key: string, value: Variable | Variable[]): void {
    const _value: Variable[] = Array.isArray(value) ? value : [value];
    if (this.entries.has(key)) {
      const decorations = this.entries.get(key);
      this.entries.set(key, decorations.concat(_value));
    } else {
      this.entries.set(key, _value);
    }
  }

  // public addEntries(entries: ExtractedDeclarationPlus[]) {
  //   entries.forEach(({
  //     varName,
  //     color,
  //     content,
  //     fileName,
  //     line
  //   }) => {
  //     const entry = this.get(varName, fileName, line);
  //     // color = color || this.getColor(content, fileName, line);
  //     if (entry.length !== 0) {
  //       entry[0].update(<Color>color);
  //     } else {
  //       const variable = new Variable(varName, <Color>color, {
  //         fileName,
  //         line
  //       });
  //       this.addEntry(varName, variable);
  //     }
  //   });
  // }

  public get count(): number {
    return this.entries.size;
  }

  // need to create a proxy (?) to always return the same variable.
  public findDeclaration(variable: string, file: string, line: number): Variable {
    return this.findClosestDeclaration(variable, file, line);
  }

  // need to create a proxy (?) to always return the same variable.
  public findClosestDeclaration(variable: string, file: string, line ?: number): Variable {
    let decorations = this.get(variable, file);
    if (decorations.length === 0) {
      decorations = this.get(variable);
    }
    if (decorations.length === 0) {
      this.delete(variable);
    }
    decorations = this.filterDecorations(decorations, file);
    if (line) {
      decorations = decorations.filter(decoration => decoration.location.line === line);
    } else {
      decorations = decorations.sort((a, b) => a.location.line - b.location.line);
    }

    const _closest = decorations[decorations.length - 1];
    let closest = decorations.pop();
    while (closest && closest.color === undefined) {
      closest = decorations.pop();
    }
    return closest || _closest;
  }

  private filterDecorations(decorations, dir) {
    const folder = dirname(dir);
    const r = new RegExp(`^${encodeURI(folder)}`);
    const decorationsFound = decorations.filter((deco: Variable) => r.test(encodeURI(deco.location.fileName)));
    if (decorationsFound.length !== 0 || folder === dir) {
      return decorationsFound;
    }
    return this.filterDecorations(decorations, folder);
  }
}

export default VariablesStore;
