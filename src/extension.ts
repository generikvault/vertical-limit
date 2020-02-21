// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vertical-jump" is now active!');

	let up = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockFirstLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		let document = editor.document

		editor.selections = editor.selections.map(selection => {
			var bp = new BlockPosition(document, selection.start)

			while (bp.dec());
			return bp.selection
		})
	});

	let down = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockLastLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		let document = editor.document

		editor.selections = editor.selections.map(selection => {
			var bp = new BlockPosition(document, selection.end)

			while (bp.inc());
			return bp.selection
		})
	});

	let selectUp = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockFirstLineSelect', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		let document = editor.document

		editor.selections = editor.selections.map(selection => {
			var bp = new BlockPosition(document, selection.start)

			while (bp.dec());
			return new vscode.Selection(selection.end, bp.position)
		})
	});

	let selectDown = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockLastLineSelect', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		let document = editor.document
		editor.selections = editor.selections.map(selection => {
			var bp = new BlockPosition(document, selection.end)

			while (bp.inc());

			return new vscode.Selection(selection.start, bp.position)
		})
	});

	let insertUp = vscode.commands.registerCommand('extension.vertical-jump.multiCursorBlockFirstLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var start = editor.selections
			.map(sel => sel.start)
			.reduce(min)

		var bp = new BlockPosition(editor.document, start)

		let selections = []
		while (bp.dec())
			selections.push(bp.selection)
		editor.selections = selections.reverse().concat(editor.selections);
	});

	let insertDown = vscode.commands.registerCommand('extension.vertical-jump.multiCursorsBlockLastLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var end = editor.selections
		.map(sel => sel.end)
			.reduce(max)

		var bp = new BlockPosition(editor.document, end)

		let selections = []
		while (bp.inc())
			selections.push(bp.selection)
		editor.selections = selections.reverse().concat(editor.selections);
	});

	context.subscriptions.push(up, down, selectUp, selectDown, insertUp, insertDown);
}

function min(a:vscode.Position, b: vscode.Position):vscode.Position{
	return a.isBefore(b) ? a : b
}

function max(a:vscode.Position, b: vscode.Position):vscode.Position{
	return a.isAfter(b) ? a : b
}

class BlockPosition {
	private doc: vscode.TextDocument
	private pos: vscode.Position
	private line: number
	private inside = false
	private indent: number

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

	jump(line: number): boolean {
		let matchs = this.indentAt(line) == this.indent
		this.inside = this.inside || matchs
		if (!matchs && this.inside)
			return false

		this.line = line
		return true
	}

	private indentAt(line: number): number {
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

// this method is called when your extension is deactivated
export function deactivate() { }
