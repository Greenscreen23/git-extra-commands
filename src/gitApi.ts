import * as vscode from 'vscode';
import { API, GitExtension } from './typings/git';

let _gitApi: API | undefined;
export function gitApi() {
    if (!_gitApi) {
        _gitApi = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports.getAPI(1);
    }
    return _gitApi;
}
