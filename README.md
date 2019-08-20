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

- Generate colored background for css variables
- Generate colored background for preprocessor variables
- Generate colored background for hsl/hsla colors
- Generate colored background for cross browsers colors
- Generate colored background for css hexa color
- Generate colored background for rgb/rgba color
- Color background live update

## Options (settings)

The following Visual Studio Code settings are available for the Colorize extension.
These can be set in user preferences `(cmd+,)` or workspace settings `(.vscode/settings.json)`.

### colorize.enable_search_variables _BOOLEAN_ _default: true

By default colorize read and parse all files, in your workspace, that are targeted by the settings [colorize.languages](colorizelanguages), [colorize.include](#colorizeinclude), [colorize.exlude](#colorizeexclude)
and [colorize.files_extensions](##deprecated-colorizefiles_extensions-array)) and extract all variables. Thanks to this behavior all variables will have colored background even if you never open the file containing the declaration. _⚠️ This setting can slown down vscode at opening_

### colorize.languages _ARRAY_

Configure a list of languages that should be colorized. You can learn about languages at <https://code.visualstudio.com/docs/languages/overview>.

For example, if you want to colorize colors in `javascript` files, you just need to include it:

```json
  "colorize.languages": [
    "javascript",
    // ...
  ]
```

### colorize.include

Configure glob patterns for including files and folders. By default Colorize is enable for files matching one the languages defined in the `colorize.languages` config, with this config you can enable colorize for other files or folders. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### colorize.exclude

Configure glob patterns for excluding files and folders. Colorize will not colorized colors in these files and folders and it'll also not search for variables inside. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### [DEPRECATED] colorize.files_extensions _ARRAY_

_⚠️ this setting is deprecated, you should use [colorize.include](#colorizeinclude) instead_
Modified this option to activate colorize for files with the matching extension.

For example if you want to colorize `.diff` files:

```json
  "colorize.files_extensions": [
    ".diff"
  ]
```

### colorize.hide_current_line_decorations _BOOLEAN_ _default: true_

By default, decorations for the current line are hidden. Set this setting to `false` if you want to deactivate this behavior.

### colorize.colorized_colors _ARRAY_

This options allow you to enable/disable colorization for a type of colors.

Available colors are :

* `HEXA`: for hexadecimal colors: `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, `0xRGB`, `0xRGBA`, `0xRRGGBB` or `0xRRGGBBAA`
* `ARGB`: for argb colors: `#RGB`, `#ARGB`, `#RRGGBB` or `#AARRGGBB`
* `RGB`: for rgb colors: `rgb(r,g,b)` or `rgba(r,g,b,a)`
* `HSL`: for HSL colors: `hsl(h,s,l)` or `hsla(h,s,l,a)`
* `BROWSERS_COLORS`: for native browser's colors like `white`, `red`, `blue`...

For example, if you want to only colorize hexa colors (`#fff, #ffffff, 0xFFF`) in your files you can update the option like this :

```json
  "colorize.colorized_colors": [
    "HEXA"
  ]
```

### colorize.colorized_variables

This options allow you to enable/disable colorization for a type of variables.

For example if you use less in your project you setup the option like this

```json
  "colorize.colorized_variables": [
    "LESS"
  ]
```

_This way all @variables will be colorized_

## Roadmap

- [x] Generate background for hexa colors
- [x] Update background on color updates
- [x] Generate background for rgb colors
- [x] Generate background for rgba colors (~ missing transparency)
- [x] Generate background for hsl colors
- [x] Generate background for hsla colors (~ missing transparency)
- [x] Generate background for Predefined/Cross-browser colors
- [x] Generate background for preprocessor variables
- [x] Generate background for css variables
- [x] Config livereload

## Release

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

Bugs, feature requests and more are welcome here [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).
