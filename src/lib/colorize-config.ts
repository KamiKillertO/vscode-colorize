import { unique } from './util/array';
import { WorkspaceConfiguration, workspace, extensions, Extension, window, DecorationRangeBehavior, TextEditorDecorationType } from 'vscode';
import { generateOptimalTextColor } from './util/color-util';
import Color from './colors/color';

interface ColorizeConfig {
  languages: string[];
  isHideCurrentLineDecorations: boolean;
  colorizedVariables: string[];
  colorizedColors: string[];
  filesToExcludes: string[];
  filesToIncludes: string[];
  inferedFilesToInclude: string[];
  searchVariables: boolean;
  decorationFn: (Color) => TextEditorDecorationType
}

function getColorizeConfig(): ColorizeConfig {
  const configuration: WorkspaceConfiguration = workspace.getConfiguration('colorize', window.activeTextEditor?.document);

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
    searchVariables,
    decorationFn: generateDecorationType(configuration.get('decoration_type'))
  };
}

function generateDecorationType(decorationType = 'background'): (Color) => TextEditorDecorationType {
  switch (decorationType) {
    case 'underline':
      return function (color: Color) {
        return window.createTextEditorDecorationType({
          borderWidth: '0 0 2px 0',
          borderStyle: 'solid',
          borderColor: color.toRgbString(),
          rangeBehavior: DecorationRangeBehavior.ClosedClosed
        });
      };
    case 'background':
    default:
      return function (color: Color) {
        const rgbaString = color.toRgbString();
        return window.createTextEditorDecorationType({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: rgbaString,
          backgroundColor: `transparent;
            background-image:
              linear-gradient(${rgbaString}, ${rgbaString}),
              repeating-linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black),
              repeating-linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black); 
            background-size: 10px 10px;
            background-position: 0 0, 5px 5px;
          `,
          color: generateOptimalTextColor(color),
          rangeBehavior: DecorationRangeBehavior.ClosedClosed
        });
      };
  }
}


function inferFilesToInclude(languagesConfig: string[]): string[] {
  const filesExtensions = extensions.all.reduce((acc, extension: Extension<unknown>) => {
    if (extension.packageJSON?.contributes?.languages) {
      extension.packageJSON.contributes.languages.forEach(language => {
        if (languagesConfig.indexOf(language.id) !== -1 && language.extensions) {
          acc = [
            ...acc,
            ...language.extensions
          ];
        }
      });
    }
    return acc;
  }, []);
  return unique(filesExtensions.flat());
}

export { ColorizeConfig, getColorizeConfig };
