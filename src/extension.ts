import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './outputChannel';
import { getCWD, getCurrentBranch } from './helpers';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.interactive-rebase', async () => {
        const branch = await vscode.window.showInputBox({ placeHolder: 'Select a branch to rebase onto' } as vscode.InputBoxOptions);
        if(!branch) {
            outputChannel().appendLine('Warning: Recieved abort signal for "input rebase branch"');
            return;
        }

        exec('git rebase -i ' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
            outputChannel().appendLine('Starting rebase:');
            outputChannel().appendLine(stdout);
            outputChannel().appendLine(stderr);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.hard-reset', async () => {
        const ok = await vscode.window.showInformationMessage('You are about to overwrite your local changes with the state of origin.\n\nAre you sure to continue?', { modal: true }, 'Ok', 'Ok, Don\'t Ask Again');
        if (!ok) {
            outputChannel().appendLine('Warning: Recieved abort signal for "confirm hard reset"');
            return;
        }

        const branch = getCurrentBranch();
        if (!branch) {
            outputChannel().appendLine('Error: Unable to read current branch');
            vscode.window.showInformationMessage('Extra Git Commands: Unable to read current branch');
            return;
        }

        exec('git reset --hard origin/' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
            outputChannel().appendLine('Starting hard reset:');
            outputChannel().appendLine(stdout);
            outputChannel().appendLine(stderr);
        });
    }));
}

export function deactivate() {}
