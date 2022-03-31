import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './outputChannel';
import { getCWD, getCurrentBranch, getAllBranches } from './helpers';
import { terminal } from './terminal';
import { gitApi } from './gitApi';

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

        let rebaseMode = vscode.workspace.getConfiguration('git-extra-commands').get<string>('interactiveRebase.rebaseMode');
        if (rebaseMode === 'avoidTerminal') {
            rebaseProcess(branch);
            return;
        }
        if (rebaseMode === 'switchEditor') {
            rebaseSwitch(branch);
            return;
        }
        if (rebaseMode === 'useTerminal') {
            rebaseTerminal(branch);
            return;
        }
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

        const currentBranch = getCurrentBranch();
        if (!currentBranch) {
            outputChannel().appendLine('Error: Unable to read current branch');
            vscode.window.showInformationMessage('Extra Git Commands: Unable to read current branch');
            return;
        }

        hardReset(currentBranch);
    }));
}

function rebaseProcess(branch: string) {
    exec('git rebase -i ' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
        outputChannel().appendLine('Starting rebase:');
        outputChannel().appendLine(stdout);
        outputChannel().appendLine(stderr);
    });
}

async function rebaseSwitch(branch: string) {
    const api = gitApi();
    if (!api) {
        outputChannel().appendLine('Error: Failed to switch editor because git api was not found.');
        return;
    }

    let localEditor;
    try {
        localEditor = await api.repositories[0].getConfig('core.editor');
    } catch (err) {
        localEditor = undefined;
    }

    await api.repositories[0].setConfig('core.editor', 'code --wait');

    exec('git rebase -i ' + branch, { cwd: getCWD() }, (err, stdout, stderr) => {
        outputChannel().appendLine('Starting rebase:');
        outputChannel().appendLine(stdout);
        outputChannel().appendLine(stderr);
    });

    if (localEditor === undefined) {
        exec('git config --local --unset core.editor', { cwd: getCWD() });
    } else {
        api.repositories[0].setConfig('core.editor', localEditor);
    }
}

function rebaseTerminal(branch: string) {
    const interactiveRebaseTerminal = terminal();
    interactiveRebaseTerminal.show(false);
    interactiveRebaseTerminal.sendText('git rebase -i ' + branch, true);
}

async function hardReset(currentBranch: string) {
    const api = gitApi();
    if (!api) {
        outputChannel().appendLine('Error: Unable to fetch origin state because api was undefined');
        return;
    }
    await api.repositories[0].fetch();

    exec('git reset --hard origin/' + currentBranch, { cwd: getCWD() }, (err, stdout, stderr) => {
        outputChannel().appendLine('Starting hard reset:');
        outputChannel().appendLine(stdout);
        outputChannel().appendLine(stderr);
    });
}

export function deactivate() {}
