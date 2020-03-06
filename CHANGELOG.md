# Change Log

All notable changes to the "vertical-limit" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.6.0]- 2020-03-06

### Changed

- Added command to compress following lines with the same prefix into a single line.
- Added opposing command to uncompress lines matching the prefix pattern into a line for each segment.

## [1.5.0]- 2020-03-06

### Changed

- Added move selection to new file command.
- Added command to cut all content of an unsaved file and close it.
- Added shortcut alt e for enumerate.

## [1.4.0]- 2020-03-05

### Changed

- Forked vertical jump.
- Added enumerate command.

## [1.3.0]- 2020-02-28

### Changed

- Keep the order of inserted new cursors in order to work with multicursor commands like enumerate.

## [1.2.0]- 2020-02-22

### Changed

- Reveal active cursor position in editor after jumping

## [1.1.0] - 2020-02-21

### Changed

- Command to insert cursors until the first line of a block
  - Inserts commands only after reaching the first line of the block
- Command to insert cursors until the last line of a block
  - Inserts commands only after reaching the first line of the block

## [1.0.0] - 2020-02-21

### Added

- Command to jump to the first line of a block
- Command to jump to the last line of a block
- Command to select text until the first line of a block
- Command to select text until the last line of a block
- Command to insert cursors until the first line of a block
- Command to insert cursors until the last line of a block
