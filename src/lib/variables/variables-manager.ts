import Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';

import './strategies/css-strategy';
import './strategies/less-strategy';
import './strategies/sass-strategy';
import './strategies/stylus-strategy';
import * as fs from 'fs';
import { workspace, window, StatusBarAlignment, StatusBarItem, Uri, TextDocument } from 'vscode';
import { DocumentLine, LineExtraction } from '../util/color-util';

class VariablesManager {
  private statusBar: StatusBarItem;

  constructor() {
    this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
  }

  public async getWorkspaceVariables(includePattern: string[] = [], excludePattern: string[] = []) {
    this.statusBar.text = 'Fetching files...';
    this.statusBar.show();
    try {
      const INCLUDE_PATTERN = `{${includePattern.join(',')}}`;
      const EXCLUDE_PATTERN = `{${excludePattern.join(',')}}`;
      const files: Uri[] = await workspace.findFiles(INCLUDE_PATTERN, EXCLUDE_PATTERN);
      this.statusBar.text = `Found ${files.length} files`;

      await Promise.all(this.extractFilesVariable(files));
      const variablesCount: number = VariablesExtractor.getVariablesCount();
      this.statusBar.text = `Found ${variablesCount} variables`;
    } catch (error) {
      this.statusBar.text = 'Variables extraction fail';
    }
    return;
  }

  private textToDocumentLine(text: string): DocumentLine[] {
    return text.split(/\n/)
      .map((text, index) => Object({
        'text': text,
        'line': index
      }));
  }

  private getFileContent(file: TextDocument): DocumentLine[] {
    // here deal with files without contents or unreadable content (like images)
    return file.getText()
      .split(/\n/)
      .map((text, index) => Object({
        'text': text,
        'line': index
      }));
  }

  private extractFilesVariable(files: Uri[]) {
    return files.map(async(file: Uri) => {

      // const document: TextDocument =  await workspace.openTextDocument(file.path);
      // const content: DocumentLine[] = this.getFileContent(document);
      const text = fs.readFileSync(file.fsPath, 'utf8');
      const content: DocumentLine[] = this.textToDocumentLine(text);
      return VariablesExtractor.extractDeclarations(file.fsPath, content);
    });
  }

  public findVariablesDeclarations(fileName, fileLines: DocumentLine[]): Promise <number[]> {
    return VariablesExtractor.extractDeclarations(fileName, fileLines);
  }

  public findVariables(fileName, fileLines: DocumentLine[]): Promise <LineExtraction[]> {
    return VariablesExtractor.extractVariables(fileName, fileLines);
  }

  public findVariable(variable: Variable) {
    return VariablesExtractor.findVariable(variable);
  }

  public generateDecoration(variable: Variable, line: number): VariableDecoration {
    const deco = new VariableDecoration(variable, line);
    return deco;
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
