const readdirRecursive = require('fs-readdir-recursive');
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');

exports.readStdin = function readStdin() {
  return new Promise(function(resolve, reject) {
    let code = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
      const chunk = process.stdin.read();
      if (chunk !== null) code += chunk;
    });
    process.stdin.on('end', function() {
      resolve(code);
    });
    process.stdin.on('error', reject);
  });
};
exports.readFile = function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, 'utf8', function(err, code) {
      if (err) {
        reject(err);
        return;
      }
      resolve(code);
    });
  });
};
exports.writeFile = function writeFile(filename, code) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, code, 'utf8', function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
exports.readdir = function readdir(dirname, includeDotfiles, filter) {
  return readdirRecursive(dirname, function(
    filename,
    _index,
    currentDirectory
  ) {
    const stat = fs.statSync(path.join(currentDirectory, filename));

    if (stat.isDirectory()) return true;

    return (
      (includeDotfiles || filename[0] !== '.') && (!filter || filter(filename))
    );
  });
};
exports.walk = async function walk(filenames) {
  const _filenames = [];
  const stream = fg.stream(filenames, {unique: true});
  for await (const filename of stream) {
    if (!fs.existsSync(filename)) return;

    const stat = fs.statSync(filename);
    if (stat.isDirectory()) {
      const dirname = filename;

      readdir(filename).forEach(function(filename) {
        _filenames.push(path.join(dirname, filename));
      });
    } else {
      _filenames.push(filename);
    }
  }
  return _filenames;
};
