# **Colorize**

[![codebeat badge](https://codebeat.co/badges/aec222e1-64ae-4360-a849-d077040694ca)](https://codebeat.co/projects/github-com-kamikillerto-vscode-colorize)
[![Build Status](https://travis-ci.org/KamiKillertO/vscode-colorize.svg?branch=main)](https://travis-ci.org/KamiKillertO/vscode-colorize)
[![Build status](https://ci.appveyor.com/api/projects/status/db69dsx996bdnj4p/branch/develop?svg=true)](https://ci.appveyor.com/project/KamiKillertO/vscode-colorize/branch/develop)
[![Licence](https://img.shields.io/github/license/KamiKillertO/vscode_colorize.svg)](https://github.com/KamiKillertO/vscode_colorize)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/LICENSE)

<!-- [![Version](https://vsmarketplacebadges.dev/version-short/kamikillerto.vscode-colorize.svg)]
[![Installs](https://vsmarketplacebadge.apphb.com/installs/KamiKillertO.vscode-colorize.svg)](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/kamikillerto.vscode-colorize.svg)](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize) -->

Instantly visualize css colors in your css/sass/less/postcss/stylus/XML... files.

This extension your styles files looking for colors and generate a colored background (using the color) for each of them.

![](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/demo.gif)

![](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/demo_variables.gif)

💡 [How to enable variables support](#colorizecolorized_variables)

## Features

- Generate colored background for
  - css variables
  - preprocessor variables
  - hsl/hsla colors
  - cross browsers colors (_red, blue, green..._)
  - css hexa color
  - rgb/rgba color
  - argb color
- Color background live update

## Options (settings)

The following Visual Studio Code settings are available for the Colorize extension.
These can be set in user preferences `(cmd+,)` or workspace settings `(.vscode/settings.json)`.

### colorize.languages _ARRAY_

Configure a list of languages that should be colorized. You can learn about languages at <https://code.visualstudio.com/docs/languages/overview>.

For example, if you want to colorize colors in `javascript` files, you just need to include it:

```json
  "colorize.languages": [
    "javascript",
    // ...
  ]
```

### colorize.enable_search_variables _BOOLEAN default: true_

By default colorize read and parse all files, in your workspace, that are targeted by the settings [colorize.languages](#colorizelanguages), [colorize.include](#colorizeinclude), and [colorize.exlude](#colorizeexclude) to extract extract all variables. Thanks to this behavior all variables will have colored background even if you never open the file containing the declaration. _⚠️ This setting can slown down vscode at opening_

### colorize.include

Configure glob patterns for including files and folders. By default Colorize is enable for files matching one the languages defined in the `colorize.languages` config, with this config you can enable colorize for other files or folders. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### colorize.exclude

Configure glob patterns for excluding files and folders. Colorize will not colorized colors in these files and folders and it'll also not search for variables inside. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### colorize.hide_current_line_decorations _BOOLEAN default: true_

By default, decorations for the current line are hidden. Set this setting to `false` if you want to deactivate this behavior.

### colorize.decoration_type _STRING default: "background"_

Defines the type of decoration to use. The possible values are:

<table>
  <tr>
    <th>background</th>
    <th>underline</th>
    <th>outline</th>
  </tr>
  <tr>
    <td>
      <img src='https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/decoration_background.png'/>
    </td>
    <td>
      <img src='https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/decoration_underline.png'/>
    </td>
    <td>
      <img src='https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/decoration_outline.png'/>
    </td>
  </tr>
  <tr>
    <th>dot</th>
    <th>square-dot</th>
  </tr>
  <tr>
    <td>
      <img src='https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/decoration_dot.png'/>
    </td>
    <td>
      <img src='https://raw.githubusercontent.com/kamikillerto/vscode-colorize/main/assets/decoration_square-dot.png'/>
    </td>
  </tr>
</table>

### colorize.colorized_colors _ARRAY_

This options allow you to enable/disable colorization for a type of colors.

Available colors are :

- `HEXA`: for hexadecimal colors: `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, `0xRGB`, `0xRGBA`, `0xRRGGBB` or `0xRRGGBBAA`
- `ARGB`: for argb colors: `#RGB`, `#ARGB`, `#RRGGBB` or `#AARRGGBB`
- `RGB`: for rgb colors: `rgb(r,g,b)` or `rgba(r,g,b,a)`
- `HSL`: for [HSL colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
- `BROWSERS_COLORS`: for native browser's colors like `white`, `red`, `blue`...
- `OKLAB`: for [oklab colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab)
- `OKLCH`: for [oklch colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)

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
- [x] Generate background for rgba colors
- [x] Generate background for hsl colors
- [x] Generate background for hsla colors
- [x] Generate background for Predefined/Cross-browser colors
- [x] Generate background for preprocessor variables
- [x] Generate background for css variables
- [x] Config livereload

## Release

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

Bugs, feature requests and more are welcome here [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).
