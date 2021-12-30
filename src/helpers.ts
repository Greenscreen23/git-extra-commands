import * as vscode from 'vscode';
import { exec } from 'child_process';

import { outputChannel } from "./singletons";

export function getCWD(): string | undefined {
    if (!vscode.workspace.workspaceFolders) {
        outputChannel().appendLine('Warning: Unable to read cwd because no folders are open');
        return undefined;
    }

    return vscode.workspace.workspaceFolders[0].uri.path;
}

export function getCurrentBranch(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', { cwd: getCWD() }, (err, stdout, stderr) => {
            if (err) {
                outputChannel().append('Error: ');
                outputChannel().appendLine(stderr);
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}
