import { flatten, unique } from './util/array';
import { WorkspaceConfiguration, workspace, Extension, extensions, window, commands } from 'vscode';

interface ColorizeConfig {
  languages: string[];
  filesExtensions: RegExp[];
  isHideCurrentLineDecorations: boolean;
  colorizedVariables: string[];
  colorizedColors: string[];
  filesToExcludes: string[];
  filesToIncludes: string[];
  inferedFilesToInclude: string[];
  searchVariables: boolean;
}

function getColorizeConfig(): ColorizeConfig {
  const configuration: WorkspaceConfiguration = workspace.getConfiguration('colorize');

  // remove duplicates (if duplicates)
  const colorizedVariables = Array.from(new Set(configuration.get('colorized_variables', []))); // [...new Set(array)] // works too
  const colorizedColors = Array.from(new Set(configuration.get('colorized_colors', []))); // [...new Set(array)] // works too

  const filesExtensions = configuration.get('files_extensions', []);

  displayFilesExtensionsDeprecationWarning(filesExtensions);

  const languages = configuration.get('languages', []);

  const inferedFilesToInclude = inferFilesToInclude(languages, filesExtensions).map(extension => `**/*${extension}`);

  const filesToIncludes = Array.from(new Set(configuration.get('include', [])));
  const filesToExcludes = Array.from(new Set(configuration.get('exclude', [])));

  const searchVariables = configuration.get('enable_search_variables', false);

  return {
    languages,
    filesExtensions: filesExtensions.map(ext => RegExp(`\\${ext}$`)),
    isHideCurrentLineDecorations: configuration.get('hide_current_line_decorations'),
    colorizedColors,
    colorizedVariables,
    filesToIncludes,
    filesToExcludes,
    inferedFilesToInclude,
    searchVariables
  };
}


function inferFilesToInclude(languagesConfig, filesExtensionsConfig) {
  let ext: Extension<any>[] = extensions.all;
  let filesExtensions = [];

  ext.forEach(extension => {
    if (extension.packageJSON && extension.packageJSON.contributes && extension.packageJSON.contributes.languages) {
      extension.packageJSON.contributes.languages.forEach(language => {
        if (languagesConfig.indexOf(language.id) !== -1) {
          filesExtensions = filesExtensions.concat(language.extensions);
        }
      });
    }
  });
  filesExtensions = flatten(filesExtensions); // get all languages with their files extensions ^^. Now need to filter with the one set in config
  filesExtensions = filesExtensions.concat(filesExtensionsConfig);
  return unique(filesExtensions);
}

async function displayFilesExtensionsDeprecationWarning(filesExtensionsConfig: string[]) {
  const config = workspace.getConfiguration('colorize');
  const ignoreWarning = config.get('ignore_files_extensions_deprecation');

  if (filesExtensionsConfig.length > 0 && ignoreWarning === false) {

    const updateSetting = 'Update setting';
    const neverShowAgain = 'Don\'t Show Again';
    const choice = await window.showWarningMessage('You\'re using the `colorize.files_extensions` settings. This settings as been deprecated in favor of `colorize.include`',
      updateSetting,
      neverShowAgain
    );

    if (choice === updateSetting) {
      commands.executeCommand('workbench.action.openSettings2');
    } else if (choice === neverShowAgain) {
      await config.update('ignore_files_extensions_deprecation', true, true);
    }
  }
}

export { ColorizeConfig, getColorizeConfig };
