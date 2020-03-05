# Vertical Limit

Vertical Limit is a collection of commands to modify, select and navigate text blocks in order to unlock the full potential of working with multiple cursors.

## Features

### Cursor Navigation

Vertical Limit provides cursor navigation commands to:

- jump to the first line of a block.
- jump to the last line of a block.
- select text until the first line of a block.
- select text until the last line of a block.
- insert cursors until the first line of a block.
- insert cursors until the last line of a block.

### Enumeration

Vertical Limit provides a command to insert an enumeration in all active selections.

The user can provide:

- a starting number
- an incrementation step
- the minimal number of how many times an enumeration should be inserted
- a comma seperated alternativ list of enumerations

## Glossary

### Block

A Block consists of line up text lines with the same indentation. Empty lines are consideres as indented by `-1` so that they seperate unindented lines.
