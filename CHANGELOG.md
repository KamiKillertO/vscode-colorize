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
