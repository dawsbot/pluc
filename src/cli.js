#!/usr/bin/env node
'use strict';
/* eslint-disable no-unused-expressions */

const meow = require('meow');
const updateNotifier = require('update-notifier');
const chalk = require('chalk');

const Pluc = require('./');

const okayHand = '👌';
const cli = meow(
  `Usage
    $ pluc <alias> <command>
    or
    $ pluc <alias>
    # Command is taken from most-recently executed in history

  Examples
    $ pluc gpom "git push origin master"
      Aliased "gpom" to "git push origin master"

    $ npm install
    $ pluc ni
      Aliased "ni" to "npm install"

  Options
    --destinationPath  Print file path to compiled shell
    --sourcePath   Print file path to json source
    --transpile  Manually transpile json to shell (You probably won't need)
    --projectName Manually change projectName (You probably won't need)
    `
);

updateNotifier({pkg: cli.pkg}).notify();

const logSuccess = message => console.log(chalk.green(`${okayHand}  ${message} ${okayHand}`));
const flags = cli.flags;
const hasInput = cli.input.length > 0;
const hasFlags = Object.keys(cli.flags).length !== 0;

let pluc = new Pluc();

if (!(hasInput || hasFlags)) {
  console.log(cli.help);
}

let renderFn = pluc.transpileJson;
if (hasFlags) {
  // TODO: have transpile message show where it transpiled out to
  if (flags.transpile) {
    const message = `Transpiled ${pluc.sourcePath} to ${pluc.destinationPath}`;
    pluc.transpileJson();
    logSuccess(message);
  }

  const projectName = flags.projectName;
  projectName && (pluc = new Pluc({projectName}));

  flags.sourcePath && console.log(pluc.sourcePath);
  flags.destinationPath && console.log(pluc.destinationPath);
  flags.vim && (renderFn = pluc.transpileVim);
}

if (hasInput) {
  const alias = cli.input[0];
  const command = cli.input[1] || pluc.lastCommand;
  // TODO: if alias already exists, prompt to save over
  pluc.setAlias(alias, command);
  logSuccess(`Aliased "${alias}" to "${command}"`);

  renderFn();
}
