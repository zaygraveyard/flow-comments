import path from 'path';
import fs from 'fs';
import readdirRecursive from 'fs-readdir-recursive';
import fg from 'fast-glob';

export function readStdin() {
  return new Promise(function (resolve, reject) {
    let code = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function () {
      const chunk = process.stdin.read();

      if (chunk !== null) {
        code += chunk;
      }
    });
    process.stdin.on('end', function () {
      resolve(code);
    });
    process.stdin.on('error', reject);
  });
}
export function readFile(filename) {
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
export function writeFile(filename, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filename, code, 'utf8', function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
export function readdir(dirname, includeDotfiles, filter) {
  return readdirRecursive(
    dirname,
    function (filename, _index, currentDirectory) {
      const stat = fs.statSync(path.join(currentDirectory, filename));

      if (stat.isDirectory()) {
        return true;
      }

      return (
        (includeDotfiles || filename[0] !== '.') &&
        (!filter || filter(filename))
      );
    },
  );
}
export async function walk(globs) {
  const filepaths = [];
  const stream = fg.stream(globs, { unique: true });

  for await (const filepath of stream) {
    if (!fs.existsSync(filepath)) {
      continue;
    }

    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      const dirname = filepath;

      readdir(filepath).forEach(function (filename) {
        filepaths.push(path.join(dirname, filename));
      });
    } else {
      filepaths.push(filepath);
    }
  }
  return filepaths;
}
