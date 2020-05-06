import * as vscode from 'vscode';

export async function insertAsColumn(editor: vscode.TextEditor) {
    const { document } = editor
    const clipboard = await vscode.env.clipboard.readText()
    const insert = clipboard.split("\n")

    await editor.edit(edit =>
        editor.selections.forEach(sel =>
            edit.delete(sel)
        ),
        {
            undoStopBefore: true,
            undoStopAfter: false,
        },
    )
    let lines = new Set<number>(editor.selections.map(sel => sel.active.line));
    await editor.edit(edit =>
        lines.forEach(i => {
            let line = document.lineAt(i).text
            let extended = (line + "\n").repeat(insert.length - 1)
            edit.replace(new vscode.Position(i, 0), extended)
        }),
        {
            undoStopBefore: false,
            undoStopAfter: false,
        },
    )
    let selections: vscode.Selection[] = []
    editor.selections.forEach(sel => {
        for (let i = 0; i < insert.length; i++) {
            const pos = new vscode.Position(sel.active.line + i - insert.length + 1, sel.active.character)
            selections.push(new vscode.Selection(pos, pos))
        }
    })
    editor.selections = selections
    await editor.edit(edit => {
        let i = 0
        editor.selections.forEach(sel => {
            const s = insert[i++ % insert.length].replace("\r", "")
            edit.insert(sel.active, s)
        }
        )
    },
        {
            undoStopBefore: false,
            undoStopAfter: true,
        },
    )
}
