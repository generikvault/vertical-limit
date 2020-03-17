
'use strict';
import * as vscode from 'vscode';

export async function crossInsert(editor: vscode.TextEditor) {
    const { selection, document } = editor
    const insert = (await vscode.env.clipboard.readText()).split("\n")

    // !important! does a replace of a line preserve the selections ??

    // TODO remove anything selected in order to ensure no section contain linebreaks
    // create a set of line ids
    // insert new lines
    // insert new selections
    // replace text via modulo
    const text = document.getText(selection)

    await editor.edit(edit => edit.delete(selection))

    var destination = await vscode.workspace.openTextDocument({ language: document.languageId, content: text })
    vscode.window.showTextDocument(destination)
}

// class Selections {

//     private lines: {
//         line: number,
//         selections: vscode.Selection[]
//     }[] = []

//     add(selection: vscode.Selection){
//         const i = this.selectedLinesBefore(selection.active.line)
//         if(isNaN(i)){
//             //add
//         }else{
//             this.lines[i].
//         }
//         this.lines.so
//     }

//     selectedLinesBefore(line: number): number {
//         for (var i = 0; i < this.lines.length; i++)
//             if (line == this.lines[i].line)
//                 return i
//         return NaN
//     }
// }