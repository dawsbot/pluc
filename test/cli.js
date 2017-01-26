import path from 'path';
import fs from 'fs-extra';
import test from 'ava';
import execa from 'execa';
import Conf from 'dotless-conf';

const cliLocation = path.join(__dirname, '..', 'src', 'cli.js');
const alias = 'alias';
const command = 'command';

test.beforeEach(t => {
  t.context.testName = `pluc-index-test-${Math.floor(Math.random() * 99999999)}`;
  t.context.config = new Conf({
    projectName: t.context.testName
  });
});

test.afterEach.always(t => {
  fs.removeSync(path.resolve(t.context.config.path, '..'));
});

test('two inputs', async t => {
  await execa(cliLocation, ['--projectName', t.context.testName, alias, command]);
  t.is(t.context.config.get(alias), command);
});
