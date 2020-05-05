import fs from 'fs';
import test from 'ava';
import { processSource } from '../src/main.js';

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
function remove(source) {
  return processSource(source, { command: 'remove' });
}

test('string', async (t) => {
  t.is(await remove('const a: string = 2'), 'const a = 2');
  t.is(await remove('const a/*: string*/ = 2'), 'const a = 2');
});

test('file', async (t) => {
  const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);
  const unwrappedSource = await readFile(`${__dirname}/fixtures/unwrapped.js`);

  t.snapshot(await remove(wrappedSource));
  t.snapshot(await remove(unwrappedSource));
});
