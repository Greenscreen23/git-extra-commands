import * as vscode from 'vscode';

let outputChannelVar = undefined as undefined | vscode.OutputChannel;
export function outputChannel() : vscode.OutputChannel {
    if (!outputChannelVar) {
        outputChannelVar = vscode.window.createOutputChannel('Extra-Git-Commands');
    }
    return outputChannelVar;
}
