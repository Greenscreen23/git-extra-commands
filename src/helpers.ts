import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from './outputChannel';
import { gitApi } from './gitApi';

export function getCWD(): string | undefined {
    if (!vscode.workspace.workspaceFolders) {
        outputChannel().appendLine('Warning: Unable to read cwd because no folders are open');
        return undefined;
    }

    return vscode.workspace.workspaceFolders[0].uri.path;
}

export function getCurrentBranch(): string | undefined {
    const branch = gitApi()?.repositories[0].state.HEAD?.name;
    if (branch === undefined) {
        outputChannel().appendLine('Warning: Unable to read current branch because no repository was found.');
        return undefined;
    }
    return branch;
}
