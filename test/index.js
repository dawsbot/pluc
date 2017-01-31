import path from 'path';
import fs from 'fs-extra';
import test from 'ava';
import tempWrite from 'temp-write';
import Conf from 'dotless-conf';

import Pluc from '../src';

const getRandomTestName = () => `pluc-index-test-${Math.floor(Math.random() * 99999999)}`;

const bindToContext = (context, opts) => {
  context.testName = getRandomTestName();
  opts = opts || {
    projectName: context.testName
  };
  context.config = new Conf(opts);
  context.pluc = new Pluc(opts);
};

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
  t.context.pluc.setAlias('a', 'b');
  t.is(t.context.config.get('a'), 'b', 'pluc should save alias');
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
  t.regex(fs.readFileSync(t.context.pluc.destinationPath, 'utf8'), /alias a="b"/);
});
