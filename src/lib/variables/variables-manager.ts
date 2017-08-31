import Variable from './variable';
import VariableDecoration from './variable-decoration';
import VariablesExtractor from './variables-extractor';

class VariablesManager {
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
}

export default VariablesManager;
