const minimist = require('minimist');
const {readStdin, readFile, writeFile, walk} = require('./utils.js');
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

const command = process.argv[2];
const {_: filenames, ...options} = minimist(process.argv.slice(3), {
  alias: {
    h: 'help',
  },
});

switch (command) {
case 'wrap':
case 'unwrap':
case 'remove':
  options.command = command;
  break;
default:
  options.command = null;
}

if (options.h || !options.command) {
  console.error(`flow-comments (wrap|unwrap|remove) [-h|--help] [--spaceBefore] [--spaceInside] [files...]`);
  process.exit(1);
}

options.command = require('./commands/' + options.command + '.js');

if (filenames.length > 0) {
  walk(filenames).map(async function(filename) {
    try {
      const result = await processFile(filename, options);
      await writeFile(filename, result);
    } catch (error) {
      console.error(filename, error);
    }
  });
} else {
  processStdin(options)
    .then(function(result) {
      process.stdout.write(result);
    })
    .catch(function(error) {
      console.error(error);
      process.exit(1);
    });
}
