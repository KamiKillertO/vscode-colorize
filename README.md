# __Colorize__

[![codebeat badge](https://codebeat.co/badges/aec222e1-64ae-4360-a849-d077040694ca)](https://codebeat.co/projects/github-com-kamikillerto-vscode-colorize)
[![Build Status](https://travis-ci.org/KamiKillertO/vscode-colorize.svg?branch=master)](https://travis-ci.org/KamiKillertO/vscode-colorize)
[![Build status](https://ci.appveyor.com/api/projects/status/db69dsx996bdnj4p/branch/develop?svg=true)](https://ci.appveyor.com/project/KamiKillertO/vscode-colorize/branch/develop)
[![Licence](https://img.shields.io/github/license/KamiKillertO/vscode_colorize.svg)](https://github.com/KamiKillertO/vscode_colorize)
![Version](https://vsmarketplacebadge.apphb.com/version-short/kamikillerto.vscode-colorize.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/LICENSE)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/KamiKillertO.vscode-colorize.svg)](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/kamikillerto.vscode-colorize.svg)](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)

Instantly visualize css colors in your css/sass/less/postcss/stylus/XML... files.

This extension  your styles files looking for colors and generate a colored background (using the color) for each of them.

![](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo.gif)

![](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo_variables.gif)
💡 [How to enable variables support](#colorizeactivate_variables_support_beta-boolean-default-false)

## Features

- 🆕 Generate colored background for css variables
- 🆕 Generate colored background for preprocessor variables
- Generate colored background for hsl colors
- Generate colored background for hsla colors
- Generate colored background for cross browsers colors
- Generate colored background for css hexa color
- Generate colored background for rgb color
- Generate colored background for rgba color
- Update the background when the color is updated

## Options (settings)

The following Visual Studio Code settings are available for the Colorize extension.
These can be set in user preferences `(cmd+,)` or workspace settings `(.vscode/settings.json)`.

```json
{
    "colorize.languages": [
            "css",
            "sass",
            "scss",
            "less",
            "pcss",
            "sss",
            "stylus",
            "xml",
            "svg"
    ],
    "colorize.files_extensions": [],
    "colorize.hide_current_line_decorations": true,
    "colorize.browser_color_names": true
}
```

### colorize.languages _ARRAY_

Modified this option to add or remove support for a [language](https://code.visualstudio.com/docs/languages/overview).

For example if you want to add `javascript`:

```json
  "colorize.languages": [
            "javascript",
            "css",
            "sass",
            "scss",
            "less",
            "pcss",
            "sss",
            "stylus",
            "xml",
            "svg"
    ]
```

### colorize.files_extensions _ARRAY_

Modified this option to activate colorize for files with the matching extension.

For example if you want to colorize `.diff` files:

```json
  "colorize.languages": [
            ".diff"
    ]
```

### colorize.hide_current_line_decorations _BOOLEAN_ _default: true_

By default decorations for the current line are hidden. Set this setting to false to deactivate this behavior.

### colorize.browser_color_names _BOOLEAN_ _default: true_

By default the color names recognized by most browsers within HTML and CSS documents will be colorized.
Set this property to false to not colorize these names.

### colorize.activate_variables_support_beta _BOOLEAN_ _default: false_

Set this options to true to enable variables support.
Variables support is in beta and you might encounter bugs.
Do not hesitate to report bugs [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).

## Roadmap

- [x] Generate background for hexa colors
- [x] Update background on color updates
- [x] Generate background for rgb colors
- [x] Generate background for rgba colors (~ missing transparency)
- [x] Generate background for hsl colors
- [x] Generate background for hsla colors (~ missing transparency)
- [x] Generate background for Predefined/Cross-browser colors
- [ ] Generate background for preprocessor variables 🚧
- [ ] Generate background for css variables 🚧

## Release

### Latest 0.6.x (2017.07.12)

- 💡 Hide decorations for the current line
- Variables (css, stylus, sass, less...) beta (partial decoration update)
- 🚀 Speed up decorations update

### 0.5.0 (2017.05.4)

- Generate background for hsl/hsla colors

### 0.4.x

- Generate background for cross browsers colors (white, black...)
- Add settings to easily add support for new languages
- Fix several issues and improve performance
- You can now use `.1` instead of `0.1` in your rbga colors
- No more issue with files using `\r` as end of lines
- Open/reopen your save/unsaved files is now longer a problem (no more weird generated background)

...

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

Bugs, feature requests and more are welcome here [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).
