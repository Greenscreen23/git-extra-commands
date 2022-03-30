import * as vscode from 'vscode';
import { outputChannel } from './outputChannel';
import { API, GitExtension } from './typings/git';

let _gitApi: API | undefined;
export function gitApi() {
    const extension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
    if (!extension?.enabled) {
        outputChannel().appendLine('Error: The vscode git extension is not enabled.');
        return undefined;
    }
    if (!_gitApi) {
        _gitApi = extension?.getAPI(1);
    }
    return _gitApi;
}
