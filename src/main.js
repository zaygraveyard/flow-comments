import { readStdin, readFile } from './utils.js';
import parse from './parse.js';

export const commands = {};

commands.wrap = {
  description: 'Wrap flow type annotations in comments.',
  help: [
    '--[no-]spaceBefore   If set, adds a space before the start of the added comment.',
    '--[no-]spaceInside   If set, adds a space arround the type inside the comment.',
  ],
};
commands.unwrap = {
  description: 'Unwrap flow comments type annotations.',
  help: [
    '--[no-]spaceInside   If set, removes a space from the end of the comment.',
  ],
};
commands.remove = {
  description: 'Strip flow type annotations (including in comment form).',
  help: [
    '--[no-]spaceInside   If set, removes a space from the end of the comment ones.',
  ],
};
commands['to-htm'] = {
  description:
    'Converts JSX into Tagged Templates that work with htm (like [1]).',
  help: [
    '--tag=TAG          Sets the "tag" function to prefix [Tagged Templates] with. Default: "html"',
    '',
    'Auto-import the tag (off by default):',
    '--no-import        Turn off auto-import.',
    '--import=MODULE    Auto-import the "tag" function from MODULE (`import {TAG} from MODULE`).',
    '--import.module=MODULE --import.export=EXPORT',
    '                   Auto-import the "tag" function from MODULE:',
    '                   if EXPORT == "default", `import TAG from MODULE`',
    '                   if EXPORT == "*", `import * as TAG from MODULE`',
    '                   otherwise, `import {EXPORT as TAG} from MODULE`',
    '',
    '[1]: https://github.com/developit/htm/tree/master/packages/babel-plugin-transform-jsx-to-htm',
  ],
};

export async function processSource(source, { command, ...options }) {
  if (typeof command !== 'function') {
    if (typeof command === 'string') {
      command = (await import(`./commands/${command}.js`)).default;
    } else {
      throw new TypeError(
        `command expected to be of type "function" or "string", but got "${command}" (of type "${typeof command}")`,
      );
    }
  }
  return command(parse(source), options);
}
export async function processFile(filename, options) {
  return processSource(await readFile(filename), options);
}
export async function processStdin(options) {
  return processSource(await readStdin(), options);
}
