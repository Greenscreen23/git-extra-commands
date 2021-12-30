import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './singletons';
import { getCWD, getCurrentBranch } from './helpers';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.interactive-rebase', async () => {
        const branch = await vscode.window.showInputBox({ placeHolder: 'Select a branch to rebase onto', title: 'Interactive rebase' } as vscode.InputBoxOptions);
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
        const branch = await getCurrentBranch();
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
