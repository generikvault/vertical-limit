// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import * as blocks from './blocks';
import * as enumerate from './enumerate';
import * as movetonew from './movetonew';
import * as compresslines from './compresslines';



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
		inBlockEditor('vertical-limit.moveCursorToBlockBegin', blocks.moveCursorToBlockBegin),
		inBlockEditor('vertical-limit.moveCursorToBlockEnd', blocks.moveCursorToBlockEnd),
		inBlockEditor('vertical-limit.selectUntilBlockBegin', blocks.selectUntilBlockBegin),
		inBlockEditor('vertical-limit.selectUntilBlockEnd', blocks.selectUntilBlockEnd),
		inEditor('vertical-limit.enumerate', enumerate.enumerate),
		inEditor('vertical-limit.moveSelectionToNewFile', movetonew.moveSelectionToNewFile),
		inEditor('vertical-limit.moveUnsavedFileToClipboard', movetonew.moveUnsavedFileToClipboard),
		inEditor('vertical-limit.compressLines', compresslines.compressLines),
		inEditor('vertical-limit.uncompressLines', compresslines.uncompressLines),
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
