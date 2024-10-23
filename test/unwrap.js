import fs from 'fs';
import test from 'ava';
import { processSource } from '../src/main.js';

const __dirname = import.meta.dirname;
const spaceInside = true;

function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, 'utf8', function (err, code) {
      if (err) {
        reject(err);
        return;
      }
      resolve(code);
    });
  });
}
function unwrap(source, options) {
  return processSource(source, { command: 'unwrap', ...options });
}

test('string', async (t) => {
  const source = 'const a: string = 2';

  t.is(await unwrap('const a/*: string*/ = 2'), source);
  t.is(await unwrap('const a/*: string */ = 2', { spaceInside }), source);
});

test('file', async (t) => {
  const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

  t.snapshot(await unwrap(wrappedSource), 'no space');
});
