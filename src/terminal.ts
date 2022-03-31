import * as vscode from 'vscode';

let _terminal: vscode.Terminal;
export function terminal(): vscode.Terminal {
    if (!_terminal || _terminal.exitStatus) {
        _terminal = vscode.window.createTerminal({ name: 'Extra Git Commands' });
    }
    return _terminal;
}
