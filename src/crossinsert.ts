
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

// "contributes": {
//     "configurationDefaults": {
//       "[go]": {
//         "editor.insertSpaces": false,
//         "editor.formatOnSave": true,
//         "editor.codeActionsOnSave": {
//           "source.organizeImports": true
//         }
//       }
//     },
//     "configuration": {
//       "type": "object",
//       "title": "Go",
//       "properties": {
//         "go.buildOnSave": {
//           "type": "string",
//           "enum": [
//             "package",
//             "workspace",
//             "off"
//           ],
//           "default": "package",
//           "description": "Compiles code on file save using 'go build -i' or 'go test -c -i'. Options are 'workspace', 'package', or 'off'.",
//           "scope": "resource"
//         },
//         "go.buildFlags": {
//           "type": "array",
//           "items": {
//             "type": "string"
//           },
//           "default": [],
//           "description": "Flags to `go build`/`go test` used during build-on-save or running tests. (e.g. [\"-ldflags='-s'\"])",
//           "scope": "resource"
//         },
//         "go.buildTags": {
//           "type": "string",
//           "default": "",
//           "description": "The Go build tags to use for all commands, that support a `-tags '...'` argument. When running tests, go.testTags will be used instead if it was set.",
//           "scope": "resource"
//         },
//         "go.testTags": {
//           "type": [
//             "string",
//             "null"
//           ],
//           "default": null,
//           "description": "The Go build tags to use for when running tests. If null, then buildTags will be used.",
//           "scope": "resource"
//         },
//         "go.installDependenciesWhenBuilding": {
//           "type": "boolean",
//           "default": true,
//           "description": "If true, then `-i` flag will be passed to `go build` everytime the code is compiled.",
//           "scope": "resource"
//         },


//         import { env } from "vscode";

// export interface Clipboard {
//     write(content: string): Thenable<void>;
// }

// export class ClipboardImpl implements Clipboard {
//     public write(content: string): Thenable<void> {
//         return env.clipboard.writeText(content);
//     }
// }
