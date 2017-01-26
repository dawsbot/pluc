import path from 'path';
import fs from 'fs-extra';
import test from 'ava';
import tempWrite from 'temp-write';
import Conf from 'dotless-conf';

import Pluc from '../src';

test.beforeEach(t => {
  t.context.testName = `pluc-index-test-${Math.floor(Math.random() * 99999999)}`;
  const opts = {
    projectName: t.context.testName
  };
  t.context.config = new Conf(opts);
  t.context.pluc = new Pluc(opts);
});

test.afterEach.always(t => {
  fs.removeSync(path.resolve(t.context.config.path, '..'));
});

test('first time shellPath', t => {
  t.truthy(fs.existsSync(t.context.pluc.shellPath));
});

test('setAlias', t => {
  t.context.pluc.setAlias('a', 'b');
  t.is(t.context.config.get('a'), 'b', 'pluc should save alias');
});

test('transpileJson', async t => {
  const configPath = await tempWrite(`{"a": "b"}`, 'test.json');
  t.context.pluc.transpileJson({
    configPath
  });
  t.regex(fs.readFileSync(t.context.pluc.shellPath, 'utf8'), /alias a="b"/);
});
