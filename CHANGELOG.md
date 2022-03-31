# Change Log

## Version 1.0.0

- Initial release
- Added two commands
    - Interactive rebase (`git rebase -i <branch>`)
    - Hard reset (`git reset --hard origin/<branch>`)

## Version 1.1.0

- Feature refactoring
- Interactive Rebase
    - Now allows selecting from a list of branches, just like the normal vscodes rebase dialog
    - Allows running in a terminal or even switching `core.editor` to vscode only for the rebase.
- Hard Reset
    - Added a modal to ask before hard resetting
