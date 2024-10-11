import Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';

import './strategies/css-strategy';
import './strategies/less-strategy';
import './strategies/sass-strategy';
import './strategies/stylus-strategy';
import * as fs from 'fs';
import {
  workspace,
  window,
  StatusBarAlignment,
  StatusBarItem,
  Uri,
  ThemeColor,
  TextEditorDecorationType,
} from 'vscode';
import { DocumentLine, LineExtraction } from '../util/color-util';
import Color from '../colors/color';

class VariablesManager {
  private statusBar: StatusBarItem;

  constructor() {
    this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
  }

  public async getWorkspaceVariables(
    includePattern: string[] = [],
    excludePattern: string[] = []
  ) {
    this.statusBar.show();
    this.statusBar.text =
      'Colorize: $(loading~spin) Searching for color variables...';
    try {
      const INCLUDE_PATTERN = `{${includePattern.join(',')}}`;
      const EXCLUDE_PATTERN = `{${excludePattern.join(',')}}`;
      const files: Uri[] = await workspace.findFiles(
        INCLUDE_PATTERN,
        EXCLUDE_PATTERN
      );

      await Promise.all(this.extractFilesVariable(files));
      const variablesCount: number = VariablesExtractor.getVariablesCount();
      this.statusBar.text = `Colorize: ${variablesCount} variables`;
    } catch (error) {
      this.statusBar.color = new ThemeColor('errorForeground');
      this.statusBar.text =
        'Colorize: $(circle-slash) Variables extraction fail';
    }
    return;
  }

  private textToDocumentLine(text: string): DocumentLine[] {
    return text.split(/\n/).map((text, index) =>
      Object({
        text: text,
        line: index,
      })
    );
  }

  private extractFilesVariable(files: Uri[]) {
    return files.map(async (file: Uri) => {
      const text = fs.readFileSync(file.fsPath, 'utf8');
      const content: DocumentLine[] = this.textToDocumentLine(text);
      return VariablesExtractor.extractDeclarations(file.fsPath, content);
    });
  }

  public findVariablesDeclarations(
    fileName: string,
    fileLines: DocumentLine[]
  ): Promise<number[]> {
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
    decorationFn: (color: Color) => TextEditorDecorationType
  ): VariableDecoration {
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
