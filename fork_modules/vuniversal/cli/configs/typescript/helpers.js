const makeLoaderFinder = require('../cli/utils/makeLoaderFinder');

const babelLoaderFinder = makeLoaderFinder('babel-loader');
const tsLoaderFinder = makeLoaderFinder('ts-loader');

module.exports = {
  babelLoaderFinder,
  tsLoaderFinder,
};
