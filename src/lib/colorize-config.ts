import {
  flatten,
  unique
} from './util/array';
import {
  WorkspaceConfiguration,
  workspace,
  extensions
} from 'vscode';

interface ColorizeConfig {
  languages: string[];
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

  const languages = configuration.get('languages', []);

  const inferedFilesToInclude = inferFilesToInclude(languages).map(extension => `**/*${extension}`);

  const filesToIncludes = Array.from(new Set(configuration.get('include', [])));
  const filesToExcludes = Array.from(new Set(configuration.get('exclude', [])));

  const searchVariables = configuration.get('enable_search_variables', false);

  return {
    languages,
    isHideCurrentLineDecorations: configuration.get('hide_current_line_decorations'),
    colorizedColors,
    colorizedVariables,
    filesToIncludes,
    filesToExcludes,
    inferedFilesToInclude,
    searchVariables
  };
}


function inferFilesToInclude(languagesConfig: string[]): string[] {
  let filesExtensions = [];

  extensions.all.forEach(extension => {
    if (extension.packageJSON && extension.packageJSON.contributes && extension.packageJSON.contributes.languages) {
      extension.packageJSON.contributes.languages.forEach(language => {
        if (languagesConfig.indexOf(language.id) !== -1) {
          filesExtensions = filesExtensions.concat(language.extensions);
        }
      });
    }
  });
  filesExtensions = flatten(filesExtensions); // get all languages with their files extensions ^^. No need to filter with the one set in config
  return unique(filesExtensions);
}

export { ColorizeConfig, getColorizeConfig };
