# Change Log

All notable changes to the "vertical-limit" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.8.3] - 2020-05-06

### Fixed

- Strange fix for `insert as column` command inserts in the wrong lines.

## [1.8.2] - 2020-04-06

### Fixed

- Strange fix for `insert as column` command inserts addtional new lines.

## [1.8.0] - 2020-03-19

### Changed

- Added insert as column command.

## [1.7.0] - 2020-03-09

### Changed

- Added command to move cursor to begin of block.
- Added command to move cursor to end of block.
- Added command to extend selection to begin of block.
- Added command to extend selection to end of block.

## [1.6.0] - 2020-03-06

### Changed

- Added command to compress following lines with the same prefix into a single line.
- Added opposing command to uncompress lines matching the prefix pattern into a line for each segment.

## [1.5.0] - 2020-03-06

### Added

- Added move selection to new file command.
- Added command to cut all content of an unsaved file and close it.
- Added shortcut alt e for enumerate.

## [1.4.0] - 2020-03-05

### Added

- Command to insert enumerations in current selections.

### Changed

- Forked vertical jump.

## [1.3.0] - 2020-02-28

### Changed

- Keep the order of inserted new cursors in order to work with multicursor commands like enumerate.

## [1.2.0] - 2020-02-22

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
