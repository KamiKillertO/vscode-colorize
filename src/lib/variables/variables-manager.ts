import Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';
import { workspace, window, StatusBarAlignment, StatusBarItem, Uri, TextDocument } from 'vscode';
import { canColorize } from '../../extension';

const INCLUDE_PATTERN = '{**/*.css,**/*.sass,**/*.scss,**/*.less,**/*.pcss,**/*.sss,**/*.stylus,**/*.styl}';
const EXCLUDE_PATTERN = '{**/.git,**/.svn,**/.hg,**/CVS,**/.DS_Store,**/.git,**/node_modules,**/bower_components,**/tmp,**/dist,**/tests}';

interface DocumentLine {
  line: number;
  text: string;
}

class VariablesManager {

  public static async getWorkspaceVariables() {
    const statusBar: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);

    statusBar.text = 'Fetching files...';
    statusBar.show();
    try {
      const files: Uri[] = await workspace.findFiles(INCLUDE_PATTERN, EXCLUDE_PATTERN);
      statusBar.text = `Found ${files.length} files`;

    let variables: Map<String, Variable[]> = (await Promise.all(this.extractFilesVariable(files))).pop(); // pop ><
    statusBar.text = `Found ${variables.size} variables`;
    } catch (error) {
      statusBar.text = 'Variables extraction fail';
    }
    return;
  }

  private static getFileContent(file: TextDocument): DocumentLine[] {
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

  private static extractFilesVariable(files: Uri[]) {
    return files.map(async(file) => {
      const document: TextDocument =  await workspace.openTextDocument(file.path);
      const content: DocumentLine[] = this.getFileContent(document);
      const variables = await Promise.all(content.map(line => this.findVariablesDeclarations(document.fileName, line.text, line.line)));
      return variables[variables.length - 1 ];
    });
  }


  public static findVariablesDeclarations(fileName, text, line): Promise <Map<String, Variable[]>> {
    return VariablesExtractor.extractDeclarations(fileName, text, line);
  }

  public static findVariables(fileName, text): Promise <Variable[]> {
    return VariablesExtractor.extractVariables(fileName, text);
  }

  public static generateDecoration(Variable: Variable): VariableDecoration {
    const deco = new VariableDecoration(Variable);
    Variable.registerObserver(deco);
    return deco;
  }

  public static deleteVariableInLine(fileName: string, line: number) {
    VariablesExtractor.deleteVariableInLine(fileName, line);
  }
}

export default VariablesManager;
