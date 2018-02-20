import Variable from './variable';
import Color, { IColor } from '../colors/color';
import { dirname } from 'path';

class VariablesStore {
  private entries: Map < string, Variable[] > = new Map();

  public has(variable: string = null, fileName: string = null, line: number = null) {
    const declarations = this.get(variable, fileName, line);
    return declarations && declarations.length > 0;
  }

  public get(variable: string, fileName: string = null, line: number = null): Variable[] {
    let decorations = this.entries.get(variable) || [];
    if (fileName !== null) {
      decorations = decorations.filter(_ => _.declaration.fileName === fileName);
    }
    if (line !== null) {
      decorations = decorations.filter(_ => _.declaration.line === line);
    }
    return decorations;
  }
  public delete(variable: string, fileName: string = null, line: number = null) {
    let decorations = this.get(variable);
    if (decorations === undefined) { // cannot be undefined??
      return;
    }
    if (fileName === null) {
      decorations.forEach(_ => _.dispose());
      this.entries.delete(variable);
      return;
    }
    if (line !== null) {
      decorations.filter(_ => _.declaration.fileName === fileName && _.declaration.line === line).forEach(_ => _.dispose());
      decorations = decorations.filter(_ => _.declaration.fileName !== fileName || (_.declaration.fileName === fileName && _.declaration.line !== line));
    } else {
      decorations.filter(_ => _.declaration.fileName === fileName).forEach(_ => _.dispose());
      decorations = decorations.filter(_ => _.declaration.fileName !== fileName);
    }
    if (decorations.length === 0) {
      this.entries.delete(variable);
      return;
    }
    this.entries.set(variable, decorations);
    return;
  }

  // not sure it should be here ><
  private getColor(match, fileName, line): Color {
    let color = null;
    let varName = match[1] || match[2];
    let variables: Variable[] = [].concat(this.get(varName, fileName, line));
    if (variables.length === 0) {
      variables = [].concat(this.get(varName));
    }
    if (variables.length !== 0) {
      color = new Color(varName, match.index, 1, variables.pop().color.rgb);
    }
    return color;
  }

  public addEntry(key: string, value: Variable | Variable[]) {
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
  public get count() {
    return this.entries.size;
  }

  public findClosestDeclaration(variable, file): Variable {
    let decorations = this.get(variable, file);
    if (decorations.length === 0) {
      decorations = this.get(variable);
    }
    if (decorations.length === 0) {
      this.delete(variable);
    }
    decorations = this.filterDecorations(decorations, file);
    decorations = decorations.sort((a, b) => a.declaration.line - b.declaration.line);
    return decorations.pop();
  }
  private filterDecorations(decorations, dir) {
    const folder = dirname(dir);
    const r = new RegExp(`^${encodeURI(folder)}`);
    let decorationsFound = decorations.filter((deco: Variable) => r.test(encodeURI(deco.declaration.fileName)));
    if (decorationsFound.length !== 0 || folder === dir) {
      return decorationsFound;
    }
    return this.filterDecorations(decorations, folder);
  }
}

export default VariablesStore;
