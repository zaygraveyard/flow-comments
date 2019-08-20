const {readStdin, readFile} = require('./utils.js');
const parse = require('./parse');

async function processSource(source, {command, ...options}) {
  return command(parse(source), options);
}
async function processFile(filename, options) {
  return processSource(await readFile(filename), options);
}
async function processStdin(options) {
  return processSource(await readStdin(), options);
}

exports.processSource = processSource;
exports.processFile = processFile;
exports.processStdin = processStdin;
