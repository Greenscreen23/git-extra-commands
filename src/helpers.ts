import * as vscode from 'vscode';

import { outputChannel } from './outputChannel';
import { gitApi } from './gitApi';
import { RefType } from './typings/git';

export function getCWD(): string | undefined {
    if (!vscode.workspace.workspaceFolders) {
        outputChannel().appendLine('Error: Unable to read cwd because no folders are open');
        return undefined;
    }

    return vscode.workspace.workspaceFolders[0].uri.path;
}

export function getCurrentBranch(): string | undefined {
    const api = gitApi();
    if (!api) {
        outputChannel().appendLine('Error: Unable to read current branch because there was no api found.');
        return undefined;
    }

    const head = api.repositories[0].state.HEAD;
    if (!head) {
        outputChannel().appendLine('Error: Unable to read current branch because no head was found.');
        return undefined;
    }

    const name = head.name;
    if (name === undefined) {
        outputChannel().appendLine('Error: Unable to read current branch because the name of the head was not found.');
        return undefined;
    }

    return name;
}


export function getAllBranches(): string[] | undefined {
    let currentBranchName = getCurrentBranch();
    if (!currentBranchName) {
        outputChannel().appendLine('Warning: Unable to read the current branch when attempting to get all branches');
        currentBranchName = '';
    }

    const api = gitApi();
    if (!api) {
        outputChannel().appendLine('Error: Unable to get all branches because there was no api found.');
        return undefined;
    }

    const branches = api.repositories[0].state.refs
        .filter(ref => ref.name !== currentBranchName && ref.type !== RefType.Tag)
        .sort((a, b) => a.type - b.type)
        .map(ref => ref.name)
        .filter(name => name !== undefined) as string[] | undefined;

    return branches;
}
