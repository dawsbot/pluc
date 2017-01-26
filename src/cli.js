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
    $ pluc <new alias> <command>
    or
    $ pluc <new alias>
    # Command is taken from most-recently executed in history

  Options
    --shellPath  Print path to compiled shell
    --jsonPath   Print path to json source
    --transpile  Manually transpile json to shell (You probably won't need)
    --projectName Manually change projectName (You probably won't need)

  Examples
    $ pluc gpom "git push origin master"
      Aliased "gpom" to "git push origin master"

    $ npm install
    $ pluc ni
      Aliased "ni" to "npm install"
    `
);

updateNotifier({pkg: cli.pkg}).notify();

const logSuccess = msg => console.log(chalk.green(msg));
const flags = cli.flags;
const hasInput = cli.input.length > 0;
const hasFlags = Object.keys(cli.flags).length !== 0;

let pluc = new Pluc();

// TODO: on postinstall, setup empty shellPath
if (!(hasInput || hasFlags)) {
  console.log(cli.help);
}

if (hasFlags) {
  // TODO: have transpile message show where it transpiled out to
  flags.transpile && pluc.transpileJson() && logSuccess('transpiled with success');

  const projectName = flags.projectName;
  projectName && (pluc = new Pluc({projectName}));

  flags.jsonPath && console.log(pluc.jsonPath);
  flags.shellPath && console.log(pluc.shellPath);
}

if (hasInput) {
  const alias = cli.input[0];
  const command = cli.input[1] || pluc.lastCommand;
  // TODO: if alias already exists, prompt to save over
  pluc.setAlias(alias, command);
  logSuccess(`${okayHand}  Aliased "${alias}" to "${command}" ${okayHand}`);

  pluc.transpileJson();
}
