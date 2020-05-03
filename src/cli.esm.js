#!/usr/bin/env node

import fs from 'fs';
import minimist from 'minimist';
import { writeFile, walk } from './utils.js';
import { processFile, processStdin } from './index.js';

function getVersion() {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/../package.json`, { encoding: 'utf8' }),
  ).version;
}

const command = process.argv[2];
const { _: filenames, ...options } = minimist(process.argv.slice(3), {
  alias: {
    h: 'help',
    v: 'version',
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

if (!options.command) {
  console.error(
    'Usage: flow-comments (wrap|unwrap|remove|to-htm) [options] [files...]',
  );
  //eslint-disable-next-line no-process-exit
  process.exit(1);
}
if (options.v) {
  console.error(`v${getVersion()}`);
  //eslint-disable-next-line no-process-exit
  process.exit(1);
}
if (options.h) {
  console.error(
    [
      'Usage: flow-comments (wrap|unwrap|remove|to-htm) [options] [files...]',
      '',
      'Options:',
      '  -h, --help       Print this screen and exit with status 1.',
      '  -v, --version    Print version and exit with status 1.',
      '',
      'wrap: Wrap flow type annotations in comments.',
      '  --[no-]spaceBefore   If set, adds a space before the start of the added comment.',
      '  --[no-]spaceInside   If set, adds a space arround the type inside the comment.',
      '',
      'unwrap: Unwrap flow comments type annotations.',
      '  --[no-]spaceInside   If set, removes a space from the end of the comment.',
      '',
      'remove: Strip flow type annotations (including in comment form).',
      '  --[no-]spaceInside   If set, removes a space from the end of the comment ones.',
      '',
      'to-htm: Converts JSX into Tagged Templates that work with htm (like [1]).',
      '  --tag=TAG          Sets the "tag" function to prefix [Tagged Templates] with. Default: "html"',
      '',
      '  Auto-import the tag (off by default):',
      '  --no-import        Turn off auto-import.',
      '  --import=MODULE    Auto-import the "tag" function from MODULE (`import {TAG} from MODULE`).',
      '  --import.module=MODULE --import.export=EXPORT',
      '                     Auto-import the "tag" function from MODULE:',
      '                     if EXPORT == "default", `import TAG from MODULE`',
      '                     if EXPORT == "*", `import * as TAG from MODULE`',
      '                     otherwise, `import {EXPORT as TAG} from MODULE`',
      '',
      '[1]: https://github.com/developit/htm/tree/master/packages/babel-plugin-transform-jsx-to-htm',
    ].join('\n'),
  );
  //eslint-disable-next-line no-process-exit
  process.exit(1);
}

if (filenames.length > 0) {
  walk(filenames).then(function (files) {
    files.map(async function (filename) {
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
    .then(function (result) {
      process.stdout.write(result);
    })
    .catch(function (error) {
      console.error(error);
      //eslint-disable-next-line no-process-exit
      process.exit(1);
    });
}
