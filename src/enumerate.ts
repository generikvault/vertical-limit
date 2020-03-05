
'use strict';
import * as vscode from 'vscode';

const enumerateInputPattern = new RegExp('^(-?[0-9]+)?(\\+-?[0-9]+)?(:[0-9]+)?$')
const listingInputPattern = new RegExp('^(([^+-:]+,)*[^+-:]+)(:[0-9]+)?$')

const readableInputPattern = '[<start>][+<step>][:<lastArg>] or <first>,<second>,...[:<amount>]'

export async function enumerate(editor: vscode.TextEditor) {
    const input = await vscode.window.showInputBox({
        value: initValue(editor),
        valueSelection: [0, initValue.length],
        placeHolder: "1+1:" + editor.selections.length,
        prompt: readableInputPattern,
        validateInput: input => {
            var parsed = enumeration(input)
            if (typeof parsed == "string")
                return parsed
            return null
        }
    });
    if (input == null) {
        return
    }
    var enums = enumeration(input) as Enumeration

    var missingSelections = enums.times - editor.selections.length

    if (missingSelections > 0) {
        var selection = editor.selections[editor.selections.length - 1]
        var endLine = selection.end.line
        var endLineLength = editor.document.lineAt(endLine).text.length
        var range = new vscode.Range(
            new vscode.Position(selection.start.line, 0),
            new vscode.Position(endLine, endLineLength),
        )
        var s = "\n"+editor.document.getText(range)
        var lineNumber = linesOf(s)
        s = s.repeat(missingSelections)

        await editor.edit(
            editBuilder => editBuilder.insert(new vscode.Position(endLine, endLineLength + 1), s),
            {
                undoStopBefore: true,
                undoStopAfter: false,
            },
        );

        var fixmeLine = endLine + missingSelections * lineNumber
        var selections = editor.selections.map(sel =>{
            if (sel.end.line == fixmeLine){
                return new vscode.Selection(
                    new vscode.Position(sel.anchor.line == fixmeLine ? endLine : sel.anchor.line, sel.anchor.character),
                    new vscode.Position(sel.active.line == fixmeLine ? endLine : sel.active.line, sel.active.character),
                )
            }
            return sel
        })
        for (var i = 0; i < missingSelections; i++) {
            selection = new vscode.Selection(
                new vscode.Position(selection.anchor.line + lineNumber, selection.anchor.character),
                new vscode.Position(selection.active.line + lineNumber, selection.active.character),
            )
            selections.push(selection)
        }
        editor.selections = selections
    }

    editor.edit(editBuilder => {
        var i = 0
        editor.selections.forEach(sel =>
            editBuilder.replace(sel, enums.value(i++)))
    },
        {
            undoStopBefore: missingSelections == 0,
            undoStopAfter: true,
        },
    );
}

interface Enumeration {
    times: number
    value(i: number): string
}

function enumeration(input: string): Enumeration | string {
    var args = enumerateInputPattern.exec(input)
    if (args == null) {
        return listing(input)
    }

    var step = parseIntFlag(args[2], 1)
    var begin = parseIntValue(args[1], step)
    var times = parseIntFlag(args[3], NaN)

    return {
        times: times,
        value: (i: number) => (begin + (step * i)).toString()
    }
}

function parseIntFlag(s: string | undefined, def: number): number {
    if (!s || s.length < 1) {
        return def
    }
    return parseIntValue(s.substr(1), def)
}

function parseIntValue(s: string | undefined, def: number): number {
    if (!s) {
        return def
    }
    var i = parseInt(s)
    if (isNaN(i)) {
        return def
    }
    return i
}

function listing(input: string): Enumeration | string {
    var args = listingInputPattern.exec(input)
    if (args == null || !(args[1])) {
        return readableInputPattern
    }

    var enums = args[1].split(",")
    var times = parseIntFlag(args[3], enums.length)

    return {
        times: times,
        value: (i: number) => enums[i % enums.length]
    }
}

const badListingSymbolsPattern = new RegExp('\\+|:|,')
function initValue(editor: vscode.TextEditor): string {
    var doc = editor.document

    if (editor.selection.isEmpty) {
        return ""
    }

    var first = doc.getText(editor.selection)
    var begin = parseInt(first)
    if (isNaN(begin)) {
        var texts = editor.selections.map(doc.getText)
        if (matchs(texts, s => badListingSymbolsPattern.test(s))) {
            return ""
        }
        return texts.join(",")
    }

    if (editor.selections.length >= 2) {
        var secondStr = doc.getText(editor.selections[1])
        var second = parseInt(secondStr)
        if (!isNaN(second)) {
            return first + "+" + (begin - second).toString()
        }
    }

    return first
}

function matchs<T>(list: T[], fn: (entry: T) => boolean): boolean {
    for (var i = 0; i < list.length; i++) {
        if (!fn(list[i]))
            return false
    }
    return true
}


function linesOf(s: string): number {
    var n = 0
    for (var i = s.indexOf("\n", 0) + 1; i > 0; i = s.indexOf("\n", i) + 1) {
        n++
    }
    return n;
}