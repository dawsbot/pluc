import path from 'path';
import fs from 'fs-extra';
import test from 'ava';
import execa from 'execa';

import {bindToContext} from './_helpers';

const cliLocation = path.join(__dirname, '..', 'src', 'cli.js');
const alias = 'alias';
const command = 'command';

test.beforeEach(t => {
  bindToContext(t.context);
});

test.afterEach.always(t => {
  fs.removeSync(path.resolve(t.context.config.path, '..'));
});

test('two inputs', async t => {
  const {testName, config} = bindToContext({}, {configName: 'shell'});
  await execa(cliLocation, ['--projectName', testName, alias, command]);
  t.is(config.get(alias), command);
});
