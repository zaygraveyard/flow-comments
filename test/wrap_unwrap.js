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
async function wrapUnwrap(source, options) {
  return processSource(
    await processSource(source, { command: 'wrap', ...options }),
    { command: 'unwrap', ...options },
  );
}
async function wrapUnwrap2(source, options) {
  return wrapUnwrap(await wrapUnwrap(source, options), options);
}
async function same(t, fn, source, options) {
  t.is(await fn(source, options), source);
}

test('string - wrap -> unwrap', async (t) => {
  const source = 'const a: string = 2';

  await same(t, wrapUnwrap, source);
  await same(t, wrapUnwrap, source, { spaceInside });
});

test('string - (wrap -> unwrap) x2', async (t) => {
  const source = 'const a: string = 2';

  await same(t, wrapUnwrap2, source);
  await same(t, wrapUnwrap2, source, { spaceInside });
});

test('file - wrap -> unwrap', async (t) => {
  const unwrappedSource = await readFile(`${__dirname}/fixtures/unwrapped.js`);

  t.is(await wrapUnwrap(unwrappedSource), unwrappedSource, 'no space');
  t.is(
    await wrapUnwrap(unwrappedSource, { spaceInside }),
    unwrappedSource,
    'space inside',
  );
});

test('file - (wrap -> unwrap) x2', async (t) => {
  const unwrappedSource = await readFile(`${__dirname}/fixtures/unwrapped.js`);

  t.is(await wrapUnwrap2(unwrappedSource), unwrappedSource, 'no space');
  t.is(
    await wrapUnwrap2(unwrappedSource, { spaceInside }),
    unwrappedSource,
    'space inside',
  );
});
