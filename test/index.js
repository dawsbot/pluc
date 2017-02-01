import path from 'path';
import fs from 'fs-extra';
import test from 'ava';
import tempWrite from 'temp-write';

import Pluc from '../src';
import {getRandomTestName, bindToContext} from './_helpers';

test.beforeEach(t => {
  bindToContext(t.context);
});

test.afterEach.always(t => {
  fs.removeSync(path.resolve(t.context.config.path, '..'));
});

test('first time destinationPath', t => {
  t.truthy(fs.existsSync(t.context.pluc.destinationPath));
});

test('setAlias', t => {
  const {config, pluc} = bindToContext({}, {configName: 'shell'});
  pluc.setAlias('a', 'b');
  t.is(config.get('a'), 'b', 'pluc should save alias');
});

test('custom configName sourcePath & destinationPath', t => {
  const opts = {
    configName: 'customConfigName',
    projectName: getRandomTestName()
  };
  const pluc = new Pluc(opts);
  t.regex(pluc.sourcePath, /customConfigName/);
  t.regex(pluc.destinationPath, /customConfigName\.sh/);
});

test('transpileJson', async t => {
  const configPath = await tempWrite(`{"a": "b"}`, 'test.json');
  t.context.pluc.transpileJson({
    configPath
  });
  t.regex(t.context.pluc.sourcePath, /shell\.json/);
  t.regex(t.context.pluc.destinationPath, /shell\.sh/);
  t.regex(fs.readFileSync(t.context.pluc.destinationPath, 'utf8'), /alias a="b"/);
});

test('transpileVim', async t => {
  const {pluc} = bindToContext({}, {configName: 'vim'});
  const configPath = await tempWrite(`{"a": "b"}`, 'test.json');
  pluc.transpileVim({
    configPath
  });
  t.regex(pluc.sourcePath, /vim\.json/);
  t.regex(pluc.destinationPath, /vim\.sh/);
  t.regex(fs.readFileSync(pluc.destinationPath, 'utf8'), /command a b/);
});
