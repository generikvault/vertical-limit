
'use strict';
import * as vscode from 'vscode';

export async function moveSelectionToNewFile(editor: vscode.TextEditor) {
    const { selection, document } = editor
    const text = document.getText(selection)

    await editor.edit(edit => edit.delete(selection))

    var destination = await vscode.workspace.openTextDocument({ language: document.languageId, content: text })
    vscode.window.showTextDocument(destination)
}

export async function moveUnsavedFileToClipboard(editor: vscode.TextEditor) {
    const { document } = editor
    if (!document.isUntitled) return

    const linePos = document.lineCount - 1
    const charPos = document.lineAt(linePos).text.length
    editor.selection = new vscode.Selection(
        new vscode.Position(0, 0),
        new vscode.Position(linePos, charPos),
    )
    await vscode.commands.executeCommand("editor.action.clipboardCutAction")
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor")
}
