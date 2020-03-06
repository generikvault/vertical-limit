
'use strict';
import * as vscode from 'vscode';

export async function compressLines(editor: vscode.TextEditor) {
    const input = await showInputBox(editor);
    if (input == null) {
        return
    }
    var { prefixExp, seperator } = input
    var { document } = editor
    var { lineCount } = document
    var deltas = new Deltas(document)
    for (var i = 0; i < lineCount; i++) {
        var text = document.lineAt(i).text
        var match = prefixExp.exec(text)
        if (!match) continue
        var prefix = match[0]

        for (var j = i + 1; j < lineCount; j++) {
            var toCompress = document.lineAt(j).text
            if (!hasPrefix(toCompress, prefix)) {
                break;
            }
            text += seperator + removePrefix(toCompress, prefix)
        }
        j -= 1
        if (i < j) {
            deltas.push(i, j, text)
        }
        i = j
    }
    editor.edit(e=>deltas.apply(e))
}
export async function uncompressLines(editor: vscode.TextEditor) {
    const input = await showInputBox(editor);
    if (input == null) {
        return
    }
    var { prefixExp, seperator } = input
    var { document } = editor
    var { lineCount } = document
    var deltas = new Deltas(document)
    for (var i = 0; i < lineCount; i++) {
        var text = document.lineAt(i).text
        var match = prefixExp.exec(text)
        if (!match) continue
        var prefix = match[0]
        var segments = removePrefix(text, prefix).split(seperator)
        var lines = segments.map(s => prefix + s).join("\n")
        deltas.push(i, i, lines)
    }
    editor.edit(e=>deltas.apply(e))
}

class Deltas {
    document: vscode.TextDocument
    deltas: { from: number, to: number, text: string }[] = []

    constructor(document: vscode.TextDocument) {
        this.document = document
    }

    push(from: number, to: number, text: string) {
        this.deltas.push({ from, to, text })
    }

    apply(edit: vscode.TextEditorEdit) {
        this.deltas.forEach(e => {
            var { from, to, text } = e
            var range = new vscode.Range(
                new vscode.Position(from, 0),
                new vscode.Position(to, this.document.lineAt(to).text.length)
            )
            edit.replace(range, text)
        });
    }
}

function hasPrefix(s: string, prefix: string): boolean {
    return s.substring(0, prefix.length) === prefix
}

function removePrefix(s: string, prefix: string): string {
    return s.substring(prefix.length)
}

const symbolPatternString = '!"#$%&\'()*+,-.\\/:;<=>?@[\\\\\\]\\^_`{|}~'
const selectionPrefixRecognitionPattern = new RegExp(
    '^(([^' + symbolPatternString + ']*)([' + symbolPatternString + ']+))')

function initValue(s: string): { initPrefix: string, initSeperator: string } {
    var initPrefix = ""
    var initSeperator = ""
    while (s.length > 0) {
        var match = selectionPrefixRecognitionPattern.exec(s)
        if (!match)
            return { initPrefix: "", initSeperator: "" }
        s = removePrefix(s, match[0])
        initSeperator = match[3]
        var symbols = match[3].split('').map(s => "\\" + s).join()
        initPrefix += "[^" + symbols.substring(0, 2) + "]+" + symbols
    }
    return {initPrefix, initSeperator}
}

async function showInputBox(editor: vscode.TextEditor): Promise<{ prefixExp: RegExp; seperator: string } | undefined> {
    var { selection } = editor
    var init = { initPrefix: "", initSeperator: "" }
    if (!selection.isEmpty && selection.isSingleLine) {
        var s = editor.document.getText(selection)
        init = initValue(s)
    }
    const input = await vscode.window.showInputBox({
        value: init.initPrefix,
        // placeHolder: "1+1:" + editor.selections.length,
        prompt: "Enter a regex matching the prefix' that should be compressed",
        validateInput: input => {
            try {
                if (input.substring(0, 1) != "^")
                    input = "^" + input
                new RegExp(input)
            }
            catch (e) {
                return e.toString()
            }
        }
    });
    if (input == null) {
        return Promise.resolve(undefined)
    }
    const seperator = await vscode.window.showInputBox({
        value: init.initSeperator,
        placeHolder: ";",
        prompt: "Enter a seperator for the compressed segments. The result will be <prefix><segment1><seperator><segment2>...",
    });
    if (seperator == null) {
        return Promise.resolve(undefined)
    }

    return Promise.resolve({ prefixExp: new RegExp(input), seperator: seperator })
}
