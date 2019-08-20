import { readStdin, readFile } from './utils.js';
import parse from './parse.js';

export function processSource(source, { command, ...options }) {
  return command(parse(source), options);
}
export async function processFile(filename, options) {
  return processSource(await readFile(filename), options);
}
export async function processStdin(options) {
  return processSource(await readStdin(), options);
}
