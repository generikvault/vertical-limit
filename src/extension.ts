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

		var bp = new BlockPosition(editor.document, editor.selection.start)

		while (bp.dec());

		editor.selections = [bp.selection];
	});

	let down = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockLastLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var bp = new BlockPosition(editor.document, editor.selection.end)

		while (bp.inc());

		editor.selections = [bp.selection];
	});

	let selectUp = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockFirstLineSelect', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var bp = new BlockPosition(editor.document, editor.selection.start)

		while (bp.dec());

		editor.selections = [bp.selectionFromStart];
	});

	let selectDown = vscode.commands.registerCommand('extension.vertical-jump.cursorBlockLastLineSelect', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var bp = new BlockPosition(editor.document, editor.selection.end)

		while (bp.inc());

		editor.selections = [bp.selectionFromStart];
	});

	let insertUp = vscode.commands.registerCommand('extension.vertical-jump.multiCursorBlockFirstLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var bp = new BlockPosition(editor.document, editor.selection.start)

		let selections = []
		while (bp.dec())
			selections.push(bp.selection)
		editor.selections = selections;
	});

	let insertDown = vscode.commands.registerCommand('extension.vertical-jump.multiCursorsBlockLastLine', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}

		var bp = new BlockPosition(editor.document, editor.selection.end)

		let selections = []
		while (bp.inc())
			selections.push(bp.selection)
		editor.selections = selections;
	});

	context.subscriptions.push(up, down, selectUp, selectDown, insertUp, insertDown);
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
		return this.doc.lineAt(line).firstNonWhitespaceCharacterIndex
	}

	get position(): vscode.Position {
		return new vscode.Position(this.line, this.pos.character);
	}

	get selection(): vscode.Selection {
		var pos = this.position
		return new vscode.Selection(pos, pos);
	}

	get selectionFromStart(): vscode.Selection {
		return new vscode.Selection(this.pos, this.position);
	}

}

// this method is called when your extension is deactivated
export function deactivate() { }
