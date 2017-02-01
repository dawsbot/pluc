'use strict';
const path = require('path');
const jsonFnFile = require('json-fn-file');
const buildShellScript = require('build-shell-script');
const shellHistory = require('@dawsonbotsford/shell-history');
const Conf = require('dotless-conf');

// From sean's answere here: http://stackoverflow.com/questions/3878692/aliasing-a-command-in-vim
// :command <AliasName> <string of command to be aliased>
const buildVimCommand = (prefix, suffix) => {
  return `:command ${prefix} ${suffix}`;
};

module.exports = class Pluc {
  constructor(opts, outputFileName) {
    opts = opts || {};
    const defaultConfigName = 'shell';
    opts.configName = opts.configName || defaultConfigName;
    this.config = new Conf(opts);
    this.outputFileName = outputFileName || `${opts.configName}.sh`;
    this.transpileJson();

    this.transpileJson = this.transpileJson.bind(this);
  }

  get sourcePath() {
    return this.config.path;
  }

  get destinationPath() {
    return path.join(this.config.path, '..', this.outputFileName);
  }

  // not easy to test. Left out entirely
  get lastCommand() {
    const history = shellHistory();
    return history[history.length - 2];
  }

  setAlias(alias, command) {
    this.config.set(alias, command);
  }

  transpileJson(opts) {
    opts = opts || {};
    const configPath = opts.configPath || this.config.path;
    const shebang = '#!/usr/bin/env bash';

    const transform = obj => {
      const body = Object.keys(obj).reduce((acc, key) => {
        return acc + buildShellScript.alias(key, obj[key]) + '\n';
      }, '');
      return `${shebang}\n${body}`;
    };

    jsonFnFile(configPath, this.destinationPath, transform);
    return true;
  }

  transpileVim(opts) {
    opts = opts || {};
    const configPath = opts.configPath || this.config.path;

    const transform = obj => {
      return Object.keys(obj).reduce((acc, key) => {
        return acc + buildVimCommand(key, obj[key]) + '\n';
      }, '');
    };

    jsonFnFile(configPath, this.destinationPath, transform);
    return true;
  }
};
