import type Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';

import './strategies/css-strategy';
import './strategies/less-strategy';
import './strategies/sass-strategy';
import './strategies/stylus-strategy';
import type { StatusBarItem, TextEditorDecorationType } from 'vscode';
import { window, StatusBarAlignment, ThemeColor } from 'vscode';
import type { DocumentLine } from '../util/color-util';
import type Color from '../colors/color';

class VariablesManager {
  private statusBar: StatusBarItem;

  constructor() {
    this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
  }

  private startVariableExtraction() {
    this.statusBar.show();
    this.statusBar.text =
      'Colorize: $(loading~spin) Searching for color variables...';
  }

  private updateVariableExtractionCount() {
    this.statusBar.show();
    const variablesCount: number = VariablesExtractor.getVariablesCount();
    this.statusBar.text = `Colorize: ${variablesCount} variables`;
  }

  private onVariableExtractionFail() {
    this.statusBar.show();
    this.statusBar.backgroundColor = new ThemeColor(
      'statusBarItem.errorBackground',
    );
    this.statusBar.color = new ThemeColor('statusBarItem.errorForeground');
    this.statusBar.text = 'Colorize: $(circle-slash) Variables extraction fail';
  }

  public async getWorkspaceVariables(
    filesContent: [{ fileName: string; content: DocumentLine[] }],
  ) {
    this.startVariableExtraction();
    try {
      await Promise.all(
        filesContent.map(async ({ fileName, content }) => {
          return VariablesExtractor.extractDeclarations(fileName, content);
        }),
      );

      this.updateVariableExtractionCount();
    } catch {
      this.onVariableExtractionFail();
    }
  }

  public findVariablesDeclarations(
    fileName: string,
    fileLines: DocumentLine[],
  ) {
    return VariablesExtractor.extractDeclarations(fileName, fileLines);
  }

  public findVariables(fileName: string, fileLines: DocumentLine[]) {
    return VariablesExtractor.extractVariables(fileName, fileLines);
  }

  public findVariable(variable: Variable) {
    return VariablesExtractor.findVariable(variable);
  }

  public generateDecoration(
    variable: Variable,
    line: number,
    decorationFn: (color: Color) => TextEditorDecorationType,
  ) {
    return new VariableDecoration(variable, line, decorationFn);
  }

  public setupVariablesExtractors(extractors: string[]) {
    VariablesExtractor.enableStrategies(extractors);
  }

  public deleteVariableInLine(fileName: string, line: number) {
    VariablesExtractor.deleteVariableInLine(fileName, line);
  }

  public removeVariablesDeclarations(fileName: string) {
    VariablesExtractor.removeVariablesDeclarations(fileName);
  }
}

const instance = new VariablesManager();

export default instance;
