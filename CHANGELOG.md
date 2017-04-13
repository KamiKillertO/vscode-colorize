## 0.4.1

- Fix an issue where browsers colors inside a word were colorized (#26)
- Remove the use of `Promise` in `queue.ts` to fix an error of background generation/update caused by a 1s timeout

## 0.4.0

### Changed

- Colors extractions refacto
- Support for split view (fix #20)
- Colorize all colors in gradient statement (fix #11)

### Added

- Cross browser colors extraction (#12)
- Add settings options to easily add new languages support (fix #13)

## 0.3.2

- Add stylus and XML support
- Improve deco map update on content added or removed, this should solve all sync issues
- Catch line does not exist error, avoid extension crash when all lines are removed

## 0.3.1

- Use the capture group for rgb(a) the decoration and not the complete match
- Generate decorations only once, after the end of the text analysis

## 0.3.0

- Use Promise for background generation/update for easy chaining
- Add new regex for rgb(a) colors detection
- Add new activationEvents (pcss and sss)
- Add rgb(a) color extraction
- Add rgb and luminance properties in color.ts

## 0.2.0

### Added

- Queue class for queuing document update

### Fixed

- Colored background update

## 0.1.2

### Fixed

- Colored background update

## 0.1.1

### Changed

- Logo less pixelated
- README

## 0.1.0 2017.01.17

### Added

- Regex matching css hexa colors
- Colored background generation
- Colored background update
