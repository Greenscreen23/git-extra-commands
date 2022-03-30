import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './outputChannel';
import { getCWD, getCurrentBranch, getAllBranches, fetch } from './helpers';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.interactive-rebase', async () => {
        let branches = getAllBranches();
        if (!branches) {
            outputChannel().appendLine('Warning: Unable to read the branches of this repo, showing none');
            branches = [];
        }

        const branch = await vscode.window.showQuickPick(branches, { placeHolder: 'Select a branch to rebase onto' } as vscode.InputBoxOptions);
        if(!branch) {
            outputChannel().appendLine('Error: Recieved abort signal for "input rebase branch"');
            return;
        }

        exec('git rebase -i ' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
            outputChannel().appendLine('Starting rebase:');
            outputChannel().appendLine(stdout);
            outputChannel().appendLine(stderr);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.hard-reset', async () => {
        const showWarning = vscode.workspace.getConfiguration('git-extra-commands').get<boolean>('hardReset.showWarning');
        if (showWarning) {
            const ok = await vscode.window.showInformationMessage('You are about to overwrite your local changes with the state of origin.\n\nAre you sure to continue?', { modal: true }, 'Ok', 'Ok, Don\'t Ask Again');
            if (ok === 'Ok, Don\'t Ask Again') {
                vscode.workspace.getConfiguration('git-extra-commands').update('hardReset.showWarning', false, vscode.ConfigurationTarget.Global);
            }
            if (!ok) {
                outputChannel().appendLine('Error: Recieved abort signal for "confirm hard reset"');
                return;
            }
        }

        const branch = getCurrentBranch();
        if (!branch) {
            outputChannel().appendLine('Error: Unable to read current branch');
            vscode.window.showInformationMessage('Extra Git Commands: Unable to read current branch');
            return;
        }

        await fetch();

        exec('git reset --hard origin/' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
            outputChannel().appendLine('Starting hard reset:');
            outputChannel().appendLine(stdout);
            outputChannel().appendLine(stderr);
        });
    }));
}

export function deactivate() {}
