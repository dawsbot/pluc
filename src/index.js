'use strict';
const path = require('path');
const jsonFnFile = require('json-fn-file');
const buildShellScript = require('build-shell-script');
const shellHistory = require('@dawsonbotsford/shell-history');
const Conf = require('dotless-conf');

module.exports = class Pluc {
  constructor(opts, outputFileName) {
    this.config = new Conf(opts || {});
    this.outputFileName = outputFileName || 'pluc.sh';
    this.transpileJson();
  }

  get jsonPath() {
    return this.config.path;
  }

  get shellPath() {
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
    const shellPath = opts.shellPath || this.shellPath;
    const shebang = '#!/usr/bin/env bash';

    const transform = obj => {
      const body = Object.keys(obj).reduce((acc, key) => {
        return acc + buildShellScript.alias(key, obj[key]) + '\n';
      }, '');
      return `${shebang}\n${body}`;
    };

    jsonFnFile(configPath, shellPath, transform);
    return true;
  }
};
