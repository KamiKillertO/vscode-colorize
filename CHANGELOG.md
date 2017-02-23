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

## 0.2.1

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
