# Extra Git Commands

This is a small extension to vscode, which allows setting shortcuts to two more git features.

## Features

### Interactive Rebase

The command `git-extra-commands.interactiveRebase` starts an interactive rebase in the current open directory. By default, this is using vscodes terminal, but it can also be set to using a normal process. I recommend using the gitlens extension and setting `core.editor` in the git settings to a graphical editor (e.g. vscode), because normal processes cannot execute terminal editors like vim or nano.   

### Hard Reset

The command `git-extra-commands.hardReset` performs a `git reset --hard origin/<currentBranch>` command. This can be useful, when somebody else force pushed this branch and you only want to view their progress. Because it works like the counterpart to force pushing, I like to call it "force pull", even though that has a different semantic for git.

## Requirements

This extension requires git to be installed. \([git-scm.com](https://git-scm.com)\)

## Known Issues

We are currently working on integrating tests into the extension. Currently, the tests are the default ones created bei Yeoman.

If you have any issues, please consider submitting them on [github](https://github.com/Greenscreen23/git-extra-commands)
