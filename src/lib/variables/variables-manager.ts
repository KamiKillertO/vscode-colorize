import Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';

import './strategies/css-strategy';
import './strategies/less-strategy';
import './strategies/sass-strategy';
import './strategies/stylus-strategy';

import { workspace, window, StatusBarAlignment, StatusBarItem, Uri, TextDocument } from 'vscode';
import { canColorize } from '../../extension';
import { DocumentLine, LineExtraction } from '../util/color-util';

const INCLUDE_PATTERN = '{**/*.css,**/*.sass,**/*.scss,**/*.less,**/*.pcss,**/*.sss,**/*.stylus,**/*.styl}';
const EXCLUDE_PATTERN = '{**/.git,**/.svn,**/.hg,**/CVS,**/.DS_Store,**/.git,**/node_modules,**/bower_components,**/tmp,**/dist,**/tests}';

class VariablesManager {
  private statusBar: StatusBarItem;

  constructor() {
    this.statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
  }

  public async getWorkspaceVariables() {
    this.statusBar.text = 'Fetching files...';
    this.statusBar.show();
    try {
      const files: Uri[] = await workspace.findFiles(INCLUDE_PATTERN, EXCLUDE_PATTERN);
      this.statusBar.text = `Found ${files.length} files`;

      await Promise.all(this.extractFilesVariable(files));
      let variablesCount: number = VariablesExtractor.getVariablesCount();
      this.statusBar.text = `Found ${variablesCount} variables`;
    } catch (error) {
      this.statusBar.text = 'Variables extraction fail';
    }
    return;
  }

  private getFileContent(file: TextDocument): DocumentLine[] {
    if (canColorize(file) === false) {
      return;
    }
    return file.getText()
      .split(/\n/)
      .map((text, index) => Object({
        'text': text,
        'line': index
      }));
  }

  private extractFilesVariable(files: Uri[]) {
    return files.map(async(file) => {
      const document: TextDocument =  await workspace.openTextDocument(file.path);
      const content: DocumentLine[] = this.getFileContent(document);
      return VariablesExtractor.extractDeclarations(document.fileName, content);
    });
  }

  public findVariablesDeclarations(fileName, fileLines: DocumentLine[]): Promise <number[]> {
    return VariablesExtractor.extractDeclarations(fileName, fileLines);
  }

  public findVariables(fileName, fileLines: DocumentLine[]): Promise <LineExtraction[]> {
    return VariablesExtractor.extractVariables(fileName, fileLines);
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
}

const instance = new VariablesManager();

export default instance;
