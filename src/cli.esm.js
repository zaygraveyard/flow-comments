#!/usr/bin/env node

import fs from 'fs';
import minimist from 'minimist';
import { writeFile, walk } from './utils.js';
import { commands, processFile, processStdin } from './index.js';

function getVersion() {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/../package.json`, { encoding: 'utf8' }),
  ).version;
}

const {
  _: [command, ...filenames],
  version: showVersion,
  help: showHelp,
  ...options
} = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
  },
});

options.command = commands[command] ? command : null;

if (showVersion) {
  console.error(`v${getVersion()}`);
  //eslint-disable-next-line no-process-exit
  process.exit(0);
}
if (showHelp) {
  console.error(
    [
      [
        `Usage: flow-comments [-h] [-v] (${Object.keys(commands).join(
          '|',
        )}) [options] [files...]`,
        '',
        '  -h, --help       Print this screen and exit.',
        '  -v, --version    Print version and exit.',
      ].join('\n'),
      ...Object.entries(commands).map(function ([name, { description, help }]) {
        if (!help) {
          return `${name}: ${description}`;
        }
        if (typeof help === 'string') {
          help = help.split('\n');
        }
        help = help
          .map(function (line) {
            return `  ${line}`;
          })
          .join('\n');
        return `${name}: ${description}\n${help}`;
      }),
    ].join('\n\n'),
  );
  //eslint-disable-next-line no-process-exit
  process.exit(0);
}

if (!options.command) {
  console.error(
    `Usage: flow-comments [-h] [-v] (${Object.keys(commands).join(
      '|',
    )}) [options] [files...]`,
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
