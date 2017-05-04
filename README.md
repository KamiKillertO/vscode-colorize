# Colorize

[![codebeat badge](https://codebeat.co/badges/aec222e1-64ae-4360-a849-d077040694ca)](https://codebeat.co/projects/github-com-kamikillerto-vscode-colorize) [![Build Status](https://travis-ci.org/KamiKillertO/vscode-colorize.svg?branch=master)](https://travis-ci.org/KamiKillertO/vscode-colorize) [![Build status](https://ci.appveyor.com/api/projects/status/db69dsx996bdnj4p/branch/develop?svg=true)](https://ci.appveyor.com/project/KamiKillertO/vscode-colorize/branch/develop) [![Licence](https://img.shields.io/github/license/KamiKillertO/vscode_colorize.svg)](https://github.com/KamiKillertO/vscode_colorize) ![VS Code Marketplace](http://vsmarketplacebadge.apphb.com/version-short/kamikillerto.vscode-colorize.svg)

Instantly visualize css colors in your css/sass/less/postcss/stylus/XML... files.

This extension  your styles files looking for colors and generate a colored background (using the color) for each of them.

![](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo.gif)

## Features

- 🆕 Generate colored background for cross browsers colors
- Generate colored background for css hexa color
- Generate colored background for rgb hexa color
- Generate colored background for rgba hexa color
- Update the background when the color is updated

## Options

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
    "colorize.files_extensions": []
}
```

⚠️ Reload needed after changes ️️️️⚠️

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

## Roadmap

- [x] Generate background for hexa colors
- [x] Update background on color updates
- [x] Generate background for rgb colors
- [x] Generate background for rgba colors (~ missing transparency)
- [ ] Generate background for hsl colors
- [ ] Generate background for hsla colors
- [x] Generate background for Predefined/Cross-browser colors
- [ ] Generate background for preprocessor variables
- [ ] Generate background for css variables

## Release

### Latest 0.4.2 (2017.04.27)

- You can now use `.1` instead of `0.1` in your rbga colors
- No more issue with files using `\r` as end of lines
- Open/reopen your save/unsaved files is now longer a problem (no more weird generated background)

### 0.4.1 (2017.04.13)

- Fix background generation/update timeout issue
- Fix an issue where `grey` was colored in a word (works also with white...)

### 0.4.0 (2017.04.01)

- Generate background for cross browsers colors (white, black...)
- Add settings to easily add support for new languages
- Fix several issues and improve performance

### 0.3.0 (2017.02.04)

- Add support for PostCSS
- Generate background for RGB/RGBa colors
- Stylus/XML support
- Speed up colored background generation for long files

### 0.2.x (2017.01.25)

- Improvement colored background updates

### 0.1.x (2017.01.17)

- First Release
- Add support for css hexa colors
- Background update on color update

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

Bugs, feature requests and more are welcome here [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).
