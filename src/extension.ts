// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import * as blocks from './blocks';
import * as edit from './enumerate';



function inBlockEditor(name: string, fn: (editor: blocks.Editor) => void): vscode.Disposable {
	let cmd = ()=> {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}
		fn(new blocks.Editor(editor))
	}

	return vscode.commands.registerCommand(name, cmd)
}

function inEditor(name: string, fn: (editor: vscode.TextEditor) => void): vscode.Disposable {
	let cmd = ()=> {
		let editor = vscode.window.activeTextEditor;

		if (editor == null) {
			return;
		}
		fn(editor)
	}

	return vscode.commands.registerCommand(name, cmd)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		inBlockEditor('vertical-limit.moveCursorFirstBlockLine', blocks.moveCursorFirstBlockLine),
		inBlockEditor('vertical-limit.moveCursorLastBlockLine', blocks.moveCursorLastBlockLine),
		inBlockEditor('vertical-limit.selectUntilBlockFirstLine', blocks.selectUntilBlockFirstLine),
		inBlockEditor('vertical-limit.selectUntilBlockLastLine', blocks.selectUntilBlockLastLine),
		inBlockEditor('vertical-limit.insertCursorsUntilFirstBlockLine', blocks.insertCursorsUntilFirstBlockLine),
		inBlockEditor('vertical-limit.insertCursorsUntilLastBlockLine', blocks.insertCursorsUntilLastBlockLine),
		inEditor('vertical-limit.enumerate', edit.enumerate),
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
