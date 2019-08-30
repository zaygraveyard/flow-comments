import { readStdin, readFile } from './utils.js';
import parse from './parse.js';

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
