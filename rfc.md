# Pluc RFC

Goal usage:

```sh
$ git push origin master

$ pluc gpom
# Aliased "gpom" to "git push origin master"

$ gpom
# calls "git push origin master"
```

More basic:
```sh
$ git init
# npm install output

$ pluc gi
# Aliased "gi" to "git init"

$ gi
# calls "git init"
```

## Steps To Accomplish Goal

- [x] Access user's command history
- [x] Access most recent command

- [ ] dotless conf function output file builder (make a module in itself so that vim could be accomplished)

* Append most recent command to command file
  * append to .zshrc or just **append to a specific pluc file which is accessible and editable via the pluc cli**

## Todos
1. Access most recent command -> "last-shell-command" module
2. Command file location (append to .zshrc
3. Extend dotless conf on github to also have bash aliases associated to the json object

### Aside - module ideas
* "which-exists" checks to see which out of an array of files exists
* "open-existing" modules Takes in array of filenames and if any of the file paths are to real files, returns the contents of said file

thing that connect dotless-conf to generic function
  dotless-conf

build-shell-script - alias and function builder

jsona - recursive alias builder
