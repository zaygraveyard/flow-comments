import fs from 'fs';
import test from 'ava';
import { processSource } from '../src/main.js';

const spaceBefore = true;
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
function wrap(source, options) {
  return processSource(source, { command: 'wrap', ...options });
}

test('string', async (t) => {
  const source = 'const a: string = 2';

  t.is(await wrap(source), 'const a/*: string*/ = 2');
  t.is(await wrap(source, { spaceBefore }), 'const a /*: string*/ = 2');
  t.is(await wrap(source, { spaceInside }), 'const a/*: string */ = 2');
  t.is(
    await wrap(source, { spaceBefore, spaceInside }),
    'const a /*: string */ = 2',
  );
});

test('file', async (t) => {
  const unwrappedSource = await readFile(`${__dirname}/fixtures/unwrapped.js`);

  t.snapshot(await wrap(unwrappedSource), 'no space');
  t.snapshot(await wrap(unwrappedSource, { spaceBefore }), 'space before');
  t.snapshot(await wrap(unwrappedSource, { spaceInside }), 'space inside');
  t.snapshot(
    await wrap(unwrappedSource, { spaceBefore, spaceInside }),
    'space before and inside',
  );
});
