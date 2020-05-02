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

test('string', async (t) => {
  t.is(
    await processSource('const a/*: string*/ = 2', { command: 'unwrap' }),
    'const a: string = 2',
  );
});

test('file', async (t) => {
  const unwrappedSource = await readFile(`${__dirname}/fixtures/unwrapped.js`);
  const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

  t.is(
    await processSource(wrappedSource, { command: 'unwrap' }),
    unwrappedSource,
  );
});
