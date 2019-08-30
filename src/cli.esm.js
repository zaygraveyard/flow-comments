#!/usr/bin/env node

import minimist from 'minimist';
import { writeFile, walk } from './utils.js';
import { processFile, processStdin } from '.';

const command = process.argv[2];
const { _: filenames, ...options } = minimist(process.argv.slice(3), {
  alias: {
    h: 'help',
  },
});

switch (command) {
  case 'wrap':
  case 'unwrap':
  case 'remove':
  case 'to-htm':
    options.command = command;
    break;
  default:
    options.command = null;
}

if (options.h || !options.command) {
  console.error(
    'flow-comments (wrap|unwrap|remove|to-htm) [-h|--help] [--spaceBefore] [--spaceInside] [files...]',
  );
  //eslint-disable-next-line no-process-exit
  process.exit(1);
}

if (filenames.length > 0) {
  walk(filenames).then(function(files) {
    files.map(async function(filename) {
      try {
        const result = await processFile(filename, options);

        await writeFile(filename, result);
      } catch (error) {
        console.error(filename, error);
      }
    });
  });
} else {
  processStdin(options)
    .then(function(result) {
      process.stdout.write(result);
    })
    .catch(function(error) {
      console.error(error);
      //eslint-disable-next-line no-process-exit
      process.exit(1);
    });
}
