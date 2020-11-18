// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';

export function moveCursorFirstBlockLine(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var bp = editor.blockPosition(selection.start)

		while (bp.dec());
		return bp.selection
	})
	editor.revealActiveCursor()
}

export function moveCursorLastBlockLine(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var bp = editor.blockPosition(selection.end)

		while (bp.inc());
		return bp.selection
	})
	editor.revealActiveCursor()
}

export function selectUntilBlockFirstLine(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var bp = editor.blockPosition(selection.start)

		while (bp.dec());
		return new vscode.Selection(selection.end, bp.position)
	})
	editor.revealActiveCursor()
}

export function selectUntilBlockLastLine(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var bp = editor.blockPosition(selection.end)

		while (bp.inc());
		return new vscode.Selection(selection.start, bp.position)
	})
	editor.revealActiveCursor()
}

export function moveCursorToBlockBegin(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var position = editor.firstBlockPosition(selection.start)
		return new vscode.Selection(position, position)
	})
	editor.revealActiveCursor()
}

export function moveCursorToBlockEnd(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var position = editor.lastBlockPosition(selection.end)
		return new vscode.Selection(position, position)
	})
	editor.revealActiveCursor()
}

export function selectUntilBlockBegin(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var position = editor.firstBlockPosition(selection.start)
		return new vscode.Selection(selection.end, position)
	})
	editor.revealActiveCursor()
}

export function selectUntilBlockEnd(editor: Editor) {
	editor.selections = editor.selections.map(selection => {
		var position = editor.lastBlockPosition(selection.end)
		return new vscode.Selection(selection.start, position)
	})
	editor.revealActiveCursor()
}

export function insertCursorsUntilFirstBlockLine(editor: Editor) {
	var bp = editor.blockPosition(editor.firstSelectedPosition)

	while (bp.dec())
		if (bp.inside)
			editor.selections.push(bp.selection)

	editor.selections = editor.selections
	editor.revealMostRecentSelection()
}

export function insertCursorsUntilLastBlockLine(editor: Editor) {
	var bp = editor.blockPosition(editor.lastSelectedPosition)

	while (bp.inc())
		if (bp.inside)
			editor.selections.push(bp.selection)

	editor.selections = editor.selections
	editor.revealMostRecentSelection()
}

export class Editor {
	readonly editor: vscode.TextEditor

	constructor(editor: vscode.TextEditor) {
		this.editor = editor
	}

	public get selections(): vscode.Selection[] {
		return this.editor.selections
	}

	public set selections(selections: vscode.Selection[]) {
		this.editor.selections = selections
	}

	public get firstSelectedPosition(): vscode.Position {
		return this.editor.selections
			.map(sel => sel.start)
			.reduce((a, b) => a.isBefore(b) ? a : b)
	}

	public get document(): vscode.TextDocument {
		return this.editor.document
	}

	public get lastSelectedPosition(): vscode.Position {
		return this.editor.selections
			.map(sel => sel.end)
			.reduce((a, b) => a.isAfter(b) ? a : b)
	}

	public revealActiveCursor() {
		var active = this.editor.selection.active
		this.editor.revealRange(new vscode.Selection(active, active))
	}

	public revealMostRecentSelection() {
		var all = this.editor.selections
		this.editor.revealRange(all[all.length - 1])
	}

	public blockPosition(position: vscode.Position): BlockPosition {
		return new BlockPosition(this.editor.document, position)
	}

	public firstBlockPosition(pos: vscode.Position): vscode.Position {
		var bp = new BlockPosition(this.editor.document, pos)
		if (pos.character > 0) {
			bp.inside = true
		} else {
			return this.firstOuterBlockPosition(bp)
		}
		while (bp.dec());
		return new vscode.Position(bp.line, 0)
	}

	private firstOuterBlockPosition(bp: BlockPosition): vscode.Position {
		var original = bp.indent
		var lastOriginalLine: number = NaN
		bp.indent--
		while (bp.dec() && !bp.inside) {
			if (bp.indentAt(bp.line) == original) {
				lastOriginalLine = bp.line
			} else if (bp.indent > bp.indentAt(bp.line)) {
				bp.inside = true
				bp.indent = bp.indentAt(bp.line)
			}
		}
		if (!isNaN(lastOriginalLine))
			return new vscode.Position(lastOriginalLine, 0)

		while (bp.dec());
		return new vscode.Position(bp.line, 0)
	}

	public lastBlockPosition(pos: vscode.Position): vscode.Position {
		var bp = new BlockPosition(this.editor.document, pos)
		if (pos.character < this.editor.document.lineAt(pos.line).text.length) {
			bp.inside = true
		} else {
			return this.lastOuterBlockPosition(bp)
		}
		while (bp.inc()) {
			if (!bp.inside && bp.indent > bp.indentAt(bp.line)) {
				bp.inside = true
				bp.indent = bp.indentAt(bp.line)
			}
		}
		return this.lastPosition(bp.line)
	}

	private lastOuterBlockPosition(bp: BlockPosition): vscode.Position {
		var original = bp.indent
		var lastOriginalLine: number = NaN
		bp.indent--
		while (bp.inc() && !bp.inside) {
			if (bp.indentAt(bp.line) == original) {
				lastOriginalLine = bp.line
			} else if (bp.indent > bp.indentAt(bp.line)) {
				bp.inside = true
				bp.indent = bp.indentAt(bp.line)
			}
		}
		if (!isNaN(lastOriginalLine))
			return this.lastPosition(lastOriginalLine)

		while (bp.inc());
		return this.lastPosition(bp.line)
	}

	private lastPosition(line:number):vscode.Position{
		return new vscode.Position(line, this.editor.document.lineAt(line).text.length) 
	}
}

class BlockPosition {
	private doc: vscode.TextDocument
	private pos: vscode.Position
	line: number
	inside = false
	indent: number

	constructor(doc: vscode.TextDocument, pos: vscode.Position) {
		this.doc = doc
		this.pos = pos
		this.line = pos.line
		this.indent = this.indentAt(this.line)
	}

	inc(): boolean {
		let line = this.line + 1
		if (line >= this.doc.lineCount)
			return false
		return this.jump(line)
	}

	dec(): boolean {
		let line = this.line - 1
		if (line < 0)
			return false
		return this.jump(line)
	}

	private jump(line: number): boolean {
		let matchs = this.indentAt(line) == this.indent
		if (!matchs && this.inside)
			return false

		this.inside = this.inside || matchs
		this.line = line
		return true
	}

	indentAt(line: number): number {
		let s = this.doc.lineAt(line)
		if (s.isEmptyOrWhitespace)
			return -1
		return s.firstNonWhitespaceCharacterIndex
	}

	get position(): vscode.Position {
		return new vscode.Position(this.line, this.pos.character);
	}

	get selection(): vscode.Selection {
		var pos = this.position
		return new vscode.Selection(pos, pos);
	}

}
