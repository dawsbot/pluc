const Conf = require('dotless-conf');
const Pluc = require('../src');

const getRandomTestName = () => {
  return `pluc-index-test-${Math.floor(Math.random() * 99999999)}`;
};
const bindToContext = (context, opts) => {
  context.testName = getRandomTestName();
  opts = Object.assign({}, {
    projectName: context.testName
  }, opts);
  context.config = new Conf(opts);
  context.pluc = new Pluc(opts);
  return context;
};

module.exports = {
  getRandomTestName,
  bindToContext
};
