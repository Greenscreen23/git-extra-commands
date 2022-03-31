import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './outputChannel';
import { getCWD, getCurrentBranch, getAllBranches, fetch } from './helpers';
import { terminal } from './terminal';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.interactiveRebase', async () => {
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

        let avoidTerminal = vscode.workspace.getConfiguration('git-extra-commands').get<boolean>('interactiveRebase.avoidTerminal');
        if (avoidTerminal) {
            exec('git rebase -i ' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
                outputChannel().appendLine('Starting rebase:');
                outputChannel().appendLine(stdout);
                outputChannel().appendLine(stderr);
            });
            return;
        }

        const interactiveRebaseTerminal = terminal();
        interactiveRebaseTerminal.show(false);
        interactiveRebaseTerminal.sendText('git rebase -i ' + branch, true);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('git-extra-commands.hardReset', async () => {
        let hideWarning = vscode.workspace.getConfiguration('git-extra-commands').get<boolean>('hardReset.hideWarning');
        if (!hideWarning) {
            const ok = await vscode.window.showInformationMessage('You are about to overwrite your local changes with the state of origin.\n\nAre you sure to continue?', { modal: true }, 'Ok', 'Ok, Don\'t Ask Again');
            if (ok === 'Ok, Don\'t Ask Again') {
                vscode.workspace.getConfiguration('git-extra-commands').update('hardReset.hideWarning', true, vscode.ConfigurationTarget.Global);
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
