# Changelog

## [current]

## 0.8.6

- [FEATURE] Add a new feature to colorize/update only the visible text. The feature is in beta and activable using the new setting `colorize_only_visible_beta`.
- [FIX] Remove the warning message about variables search as it's not a problem anymore.
- [FIX] Set property `rangeBehavior` to `ClosedClosed` to make sure a decoration never expand

## 0.8.5

- [FIX] No more ram pick at boot time
- [FIX] Stylus variables with underscore are now detected

## 0.8.4

- [FIX] Remove a blinking effect when updating the content of a variable.

## 0.8.3

- [CHANGE] Enable the search variables at boot time again, but explain why vscode might feel slow at opening time.

## 0.8.2

- [CHANGE] Disable search variables at boot time
- [FEATURE] Add a setting to enable/disable variables search at boot time

## 0.8.1

- [FIX] Fix an issue where alpha values with multiples `0` were not correctly colorized (like 0.00 or 1.00).

## 0.8.0

- [FEATURE] Add two new settings `colorize.include` and `colorize.exclude`. These two settings can be used to add/remove files to the list of files that can be colorized.
- [DEPRECATE] With the release of `colorize.include` and `colorize.exclude`, the setting `colorize.files_extensions` is now deprecated.
- [IMPROVEMENT] Now the list of files/folder that can be colorized or used for the variables search is determined using the three settings `colorize.include`, `colorize.exclude` and `colorize.languages`. It was static previously.
- [FIX] `}` is now a valid end for a color.

## 0.7.2

- [CHANGE] Now rgb(a) and hsl(a) colors can have decimal values

## 0.7.1

- [FIX] Fix stylus variables decoration

## 0.7.0

- [IMPROVE] Variables support fully working
- [ADDED] Options to enable/disabled colorization for colors/variables type

## 0.6.21

- [FIX] Fix css variables decoration

## 0.6.20

- [FIX] Fix perfs issue with stylus variables extraction

## 0.6.19

- [IMPROVE] Settings HOT Reload.
- [IMPROVE] Variables usage live update

## 0.6.18

- [FIX] Sass variables extraction

## 0.6.17

- [FIX] Colorize uppercased browsers colors (red, blue...)
- [IMPROVE] Colorize hexa colors with 0x prefix
- [IMPROVE] Update variables extractions. Split the variable extractions in specialized strategies (one for sass, css, less ...).

## 0.6.16

- [FIX] Split the regexp extracting variables in three to prevent a crash (the previous one was too complex).

## 0.6.15

- [FIX] Remove trailing `const` preventing variables to be decorated.

## 0.6.14

- [IMPROVE] Reduce the number of promises created during colors/variables extractions. Now the extraction of colors and variables is more than 10 times faster.

## 0.6.13

- Improve decorations contrast for variables too

## 0.6.12

- [FIX] #106 - Decorations were not disable for a line accessed from a deletion. Also hide decorations on default selected line on file opening.
- [FIX] #112 - Improve decorations contrast (between background and text) by following the WCAG guidelines ([Contrast (Enhanced)](https://www.w3.org/WAI/WCAG20/quickref/#qr-visual-audio-contrast7) and [Contrast (Minimum)](https://www.w3.org/WAI/WCAG20/quickref/#visual-audio-contrast-contrast))
- [FIX] #113 - SASS and LESS variables like `$var_1A`, $var_A` and `$var-1` were extracted but not colorized.

## 0.6.11

- [FIX] #97 - find closest declarations on windows not working due to trailing `\`
- [FIX] Variables ending with ';' not extracted

- [IMPROVE] Add more error handling to prevent colorize crash

## 0.6.10

- [IMPROVE] Wait for the end of the variables extraction before settings files/editor changes listener. Previous behavior were causing multiple useless call to the CacheManager
- Continue code splitting.

## 0.6.9

- [CHANGE] Now variables decorations are generated using the closest declaration

## 0.6.8

- [FIX] #76 - Now spaces between variables names and declarations delimiters are accepted. It means this `$myVar     :      #ffffff` is a valid variable declaration
- [ADDED] Multi-lignes cursor support to "Hide current line decorations"

## 0.6.7

- [FIX] Line deletion truncate all stored variables
- [FIX] Deleting a variable will now delete her decorations
- [FIX] Updating a variable with an invalid color will now delete her decorations

## 0.6.6

- [FIX] Variables created from another variables not colorized

## 0.6.5

- [CHANGE] Now variables created from an other variables are colorized
- [CHANGE] Add a new gif to show variables support
- [FIX] Do not extract variables without color (like size variables)

## 0.6.4

- [FIX] #62 variables not deleted
- [FIX] stylus variables not colorized
- [FIX] multiple deco for one variables use positions of the last one
- [CHANGE] Split code between color and variables (not same needs)

## 0.6.3

- [FIX] #62 variables not deleted

## 0.6.2

- [FIX] #61 New variables not colorized
- [CHANGE] Use await/async to improve code readability

## 0.6.1

- [FIX] Add missing error callback to openTextDocument (variables beta). Fix errors with binary type documents

## 0.6.0

- [ADD] Decorations toggle. Decorations on the current line are now hidden by default.
- [ADD] New a option (setting) `hide_current_line_decorations` to activate/deactivate the decoration toggle feature.
- [ADD] Variables (css, less, sass...) support under beta. The `activate_variables_support_beta` setting should be set to true in order to activate the feature.

## 0.5.1

- [FIX] fix a typo error that prevent postcss files to be colorized by default

## 0.5.0

- [ADD] Add hsl(a) color extraction
- [FIX] #35 Should prevent no longer have side effects on other extensions

## 0.4.2

- [FIX] #28, now `.x` is a valid alpha value
- [CHANGE] Add `\r` as a valid end for a color
- [CHANGE] Save files decorations in two map one for dirty files and one for saved files, fix issues with opening/reopening files

## 0.4.1

- [FIX] #26 Do not colorize browsers colors inside a word
- [CHANGE] Remove the use of `Promise` in `queue.ts` to fix an error of background generation/update caused by a 1s timeout

## 0.4.0

- [REFACTO] Colors extractions
- [FIX] #20 Support for split view
- [FIX] #11 Colorize all colors in gradient statement
- [ADD] Cross browser colors extraction (#12)
- [FIX] #13 Add a settings options to easily add new languages support

## 0.3.2

- [ADD] Stylus and XML support
- [FIX] Catch line does not exist error, avoid extension crash when all lines are removed
- [FIX] Improve deco map update on content added or removed, this should solve all sync issues

## 0.3.1

- [FIX] Use the capture group for rgb(a) the decoration and not the complete match
- [FIX] Generate decorations only once, after the end of the text analysis

## 0.3.0

### Added

- [ADD] New regex for rgb(a) colors detection
- [ADD] New activationEvents (pcss and sss)
- [ADD] rgb(a) color extraction
- [ADD] rgb and luminance properties in color.ts
- [REFACTO] Use Promise for background generation/update for easy chaining

## 0.2.0

- [ADD] `lib/Queue.ts` for queuing task. Ensure that a document update cannot cause side effect to another one.
- [FIX] Colored background update

## 0.1.2

- [FIX] Colored background update

## 0.1.1

- [CHANGE] Logo less pixelated
- [CHANGE] README

## 0.1.0 2017.01.17

- [ADD] Regex matching css hexa colors
- [ADD] Colored background generation
- [ADD] Colored background update
