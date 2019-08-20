const {parse} = require('@babel/parser');

module.exports = function parseCode(source) {
  return {
    source,
    ast: parse(source, {
      sourceType: 'unambiguous',
      plugins: ['classProperties', 'flow', 'jsx'],
    }),
  };
};
