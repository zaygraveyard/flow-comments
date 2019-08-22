/*eslint-env jest*/
/*eslint-disable import/no-commonjs, @getify/proper-arrows/this*/
const fs = require('fs');
const { processSource } = require('..');

function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, 'utf8', function(err, code) {
      if (err) {
        reject(err);
        return;
      }
      resolve(code);
    });
  });
}

describe('wrap', () => {
  const command = require('../dist/commands/wrap').default;

  test('string', () => {
    expect(processSource('const a: string = 2', { command })).toBe(
      'const a/*: string*/ = 2',
    );
  });

  test('file', async () => {
    const unwrappedSource = await readFile(
      `${__dirname}/fixtures/unwrapped.js`,
    );
    const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

    expect(processSource(unwrappedSource, { command })).toBe(wrappedSource);
  });
});

describe('unwrap', () => {
  const command = require('../dist/commands/unwrap').default;

  test('string', () => {
    expect(processSource('const a/*: string*/ = 2', { command })).toBe(
      'const a: string = 2',
    );
  });

  test('file', async () => {
    const unwrappedSource = await readFile(
      `${__dirname}/fixtures/unwrapped.js`,
    );
    const wrappedSource = await readFile(`${__dirname}/fixtures/wrapped.js`);

    expect(processSource(wrappedSource, { command })).toBe(unwrappedSource);
  });
});
