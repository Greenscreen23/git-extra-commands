import * as vscode from 'vscode';
import { outputChannel } from './outputChannel';
import { API, GitExtension } from './typings/git';

let _gitApi: API | undefined;
export function gitApi() {
    const extension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
    if (!extension?.enabled) {
        outputChannel().appendLine('Warning: The vscode git extension has not been enabled yet.');
        return undefined;
    }
    if (!_gitApi) {
        _gitApi = extension?.getAPI(1);
    }
    return _gitApi;
}
