# pluc
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![XO code style][xo-image]][xo-url]

> :ok_hand: Create permanent terminal aliases instantly

<p align="center">
  <img src="./media/logo.png" alt="logo"/>
</p>

## Install

```sh
$ npm install --global pluc
```

Now source the pluc output file in your shell. Paste this in your bash profile (~/.bashrc, ~/.zshrc, ~/.bash_profile, , or ~/.profile).

```sh
source "$(pluc-cli --destinationPath)"
function pluc() {
  pluc-cli "$@"
  source "$(pluc-cli --destinationPath)"
}
```

That also sets up a function to immediately source new aliases. Should you ignore the above bash code, you'd need to manually resource the pluc shell file per session **and** after adding a new alias.

## Verify Installation

```sh
$ pluc --sourcePath
# Should output a json filepath, not an error.
```

Your bash aliases are generated from that JSON object. You don't need to pay attention to that in most cases. That's covered in depth in the "About" section below.

## Usage

Save a new alias forever

```sh
$ pluc <alias> <command>
```

Leave out `command` and pluc will infer your last entered command

```sh
$ pluc <alias>
```

## Examples

Imagine you ssh to this machine often:

```sh
$ ssh username@username.example.org
# ssh: Successfully ssh'd to example.org!
```

But truly, you do that most days. Why should you type it out?

```sh
$ pluc sshme
# 👌 Aliased "sshme" to "ssh username@username.example.org" 👌

$ sshme
# ssh: Successfully ssh'd to example.org!
```

Not only is the alias `sshme` instantly available, it's forever available in any new sessions. The alternative is to save an `alias` in your bash profile. It's not only time consuming to open and edit, but you won't be able to use that alias until you `source` it.

<br/>

Or let's say you do web development and need a web server often:

```sh
$ pluc serve "python -m SimpleHTTPServer"
# 👌 Aliased "serve" to "python -m SimpleHTTPServer" 👌

$ serve
# Serving HTTP on 0.0.0.0 port 8000 ...
```

Ensure you quote any arguments which contain spaces. Otherwise your shell will separate each word as separate arguments.

<br/>

If you want to see the full list of commands:

```sh
$ pluc --help
```

## About

`pluc` uses a single JSON object to store aliases. Since JSON is already key-value based, it's a perfect data format. To manually edit the JSON source file (**you absolutely will eventually**) enter

```sh
$ $EDITOR $(pluc --sourcePath)
```

After any new alias is added to `pluc`, the `render` function is called which builds a shell file. The shell output is what you `source`'d at the very beginning. To see it right now, enter

```sh
$ $EDITOR $(pluc --destinationPath)
```

:warning: Do not edit the output shell file, it gets deleted on re-render (often) :warning:


## FAQ

* Why not use the `source` command in my terminal?
  * `source` is only available within your current shell. As soon as you start a new session, your alias is gone.

* How can I edit my aliases?
  * `$ $EDITOR $(pluc --sourcePath)`


* Why store the data as a JSON object?
  * If JSON objects are used as the source of truth, a variety of render methods can be used. This means that **any** output format (`vimrc`, sublime snippets, etc.) which is key-value based can be generated using `pluc`.

* What's one of these "pluc JSON objects" actually look like?

```json
{
  "gi": "git init",
  "ga": "git add"
}
```

* The history inferred by `pluc <alias>` alone is not accurate.
  * History is obtained with [@dawsonbotsford/shell-history](https://github.com/dawsonbotsford/shell-history). Please open an issue there.

<!-- * How can I add a new render method?
  1. Create and test a render function as a standalone module. (Fork [build-shell-fn](https://github.com/dawsonbotsford/build-shell-fn))
  2. Add a transpile method in [index.js](./src/index.js). (Copy `transpileJSON()`)
  3. Add a flag for render function within [cli.js](./src/cli.js)
  4. Document the new render method in the `--help` in `src/cli.js`
  5. PR!
 -->
## Compatibility Issues

* `pluc` will not create valid aliases on Windows. Windows does not save terminal history.

* `pluc` will not work with `fish` shell. It likely will not work for shells beyond bash or zsh. This is because of the `parse` function in [`@dawsonbotsford/shell-history`](https:///github.com/dawsonbotsford/shell-history) package. PR's welcome.

## License

MIT © [Dawson Botsford](http://dawsonbotsford.com)

[npm-image]: https://badge.fury.io/js/pluc.svg
[npm-url]: https://npmjs.org/package/pluc
[travis-image]: https://travis-ci.org/dawsonbotsford/pluc.svg?branch=master
[travis-url]: https://travis-ci.org/dawsonbotsford/pluc
[xo-image]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo-url]: https://github.com/sindresorhus/xo
