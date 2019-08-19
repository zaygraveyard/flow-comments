const minimist = require('minimist');
const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const MagicString = require('magic-string').default;
const readdirRecursive = require('fs-readdir-recursive');
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');

const WHITE_SPACE_REGEX = /\s/;
const FLOW_COMMENT_REGEX = /^\s*(::|flow-include\s)\s*/g;
const FLOW_SHORT_COMMENT_REGEX = /^\s*:/;

function readStdin() {
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
}
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
function writeFile(filename, code) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, code, 'utf8', function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function readdir(dirname, includeDotfiles, filter) {
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
}

async function walk(filenames, options) {
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

  _filenames.map(async function(filename) {
    try {
      const result = await processFile(filename, options);
      await writeFile(filename, result);
    } catch (error) {
      console.error(filename, error);
    }
  });
}

async function parseCode(source) {
  return {
    source,
    ast: await parse(source, {
      sourceType: 'unambiguous',
      plugins: ['classProperties', 'flow', 'jsx'],
    }),
  };
}
function addFlowComments({source, ast}, {spaceBefore, spaceInside} = {}) {
  const insideSpace = spaceInside ? ' ' : '';
  const result = new MagicString(source);
  traverse(ast, {
    TypeCastExpression(path) {
      wrapPathInFlowComment(path.get('typeAnnotation'));
      path.replaceWith(path.get('expression'));
    },

    // support function a(b?) {}
    Identifier(path) {
      const {node} = path;
      if (node.typeAnnotation) {
        const start = node.optional
          ? getStartOfToken(node, '?')
          : node.typeAnnotation.start;
        wrapInFlowComment(start, node.typeAnnotation.end);
        path.get('typeAnnotation').remove();
      } else if (node.optional) {
        const start = getStartOfToken(node, '?');
        wrapInFlowComment(start, start + 1);
      }
    },

    // support for `class X { foo: string }`
    ClassProperty(path) {
      if (!path.node.value) {
        wrapPathInFlowComment(path, path.parent.optional);
        path.remove();
      }
    },

    // support `import type A` and `import typeof A`
    ImportDeclaration(path) {
      const {node} = path;
      if (isTypeImportNode(node) || node.specifiers.length === 0) return;
      const specifiers = node.specifiers;
      const indexOfFirstNonDefaultSpecifier =
        specifiers[0].type === 'ImportDefaultSpecifier' ? 1 : 0;
      let start = NaN;
      let end;
      for (let [index, specifier] of specifiers.entries()) {
        if (isTypeImportNode(specifier)) {
          const isFirst = index === indexOfFirstNonDefaultSpecifier;
          const isLast = index === specifiers.length - 1;
          if (isNaN(start)) {
            start = isFirst
              ? specifier.start
              : getStartOfToken(specifiers[index - 1], ',');
          }
          end =
            isFirst && !isLast
              ? getStartOfToken(specifier, ',') + 1
              : specifier.end;
        } else if (!isNaN(start)) {
          wrapInFlowComment(start, end);
          start = NaN;
        }
      }
      if (!isNaN(start)) {
        wrapInFlowComment(start, end);
      }

      node.specifiers = node.specifiers.filter(isNormalImportNode);
    },

    Flow(path) {
      wrapPathInFlowComment(path, path.parent.optional);
      path.remove();
    },

    Class(path) {
      const {node} = path;
      if (!node.implements) {
        return;
      }

      const end = node.implements[node.implements.length - 1].end;
      let start;

      if (node.typeParameters && !node.superClass) {
        start = node.typeParameters.start;
        path.get('typeParameters').remove();
      } else if (node.superTypeParameters) {
        start = node.superTypeParameters.start;
        path.get('superTypeParameters').remove();
      } else {
        start = getStartOfToken(node.id, 'implements');
      }

      wrapInFlowComment(start, end);
      delete node['implements'];
    },
  });

  return result.toString();

  function getSource(node) {
    if (node.end) {
      return source.slice(node.start, node.end);
    }
    return '';
  }

  function getStartOfToken(node, token, defaultValue = -1) {
    const endOfTrailingComments =
      node.trailingComments && node.trailingComments.length > 0
        ? node.trailingComments[node.trailingComments.length - 1].end
        : node.name
        ? node.start + node.name.length
        : node.end;
    const start = source.indexOf(token, endOfTrailingComments);
    return start === -1 ? defaultValue : start;
  }

  function generateComment(start, end, optional = false) {
    let comment = source
      .slice(start, end)
      .replace(/\*-\//g, '*-ESCAPED/')
      .replace(/\*\//g, '*-/');
    if (optional) comment = '?' + comment;
    if (comment[0] !== ':') comment = '::' + insideSpace + comment;
    return `/*${comment}${insideSpace}*/`;
  }
  function wrapInFlowComment(start, end, optional) {
    const addSpace =
      spaceBefore && start > 0 && !WHITE_SPACE_REGEX.test(source[start - 1]);
    result.overwrite(
      start,
      end,
      (addSpace ? ' ' : '') + generateComment(start, end, optional)
    );
  }
  function wrapPathInFlowComment({node: {start, end}}, optional) {
    wrapInFlowComment(start, end, optional);
  }

  function isTypeImportNode(node) {
    return node.importKind === 'type' || node.importKind === 'typeof';
  }
  function isNormalImportNode(node) {
    return !isTypeImportNode(node);
  }
}
function removeFlowComments({source, ast}, {spaceInside} = {}) {
  const result = new MagicString(source);
  for (let comment of ast.comments) {
    if (comment.type !== 'CommentBlock') {
      /*ignore line comments*/
    } else if (
      FLOW_COMMENT_REGEX.test(comment.value) ||
      FLOW_SHORT_COMMENT_REGEX.test(comment.value)
    ) {
      result.overwrite(
        comment.start,
        comment.end,
        comment.value
          .slice(FLOW_COMMENT_REGEX.lastIndex)
          .replace(/ $/g, spaceInside ? '' : ' ')
          .replace(/\*-\//g, '*/')
          .replace(/\*-ESCAPED\//g, '*-/')
      );
      FLOW_COMMENT_REGEX.lastIndex = 0;
    }
  }
  return result.toString();
}

async function processSource(source, {command, ...options}) {
  return command(await parseCode(source), options);
}
async function processFile(filename, options) {
  return processSource(await readFile(filename), options);
}
async function processStdin(options) {
  return processSource(await readStdin(), options);
}

const command = process.argv[2];
const {_: filenames, ...options} = minimist(process.argv.slice(3), {
  alias: {
    h: 'help',
  },
});

if (options.h || (command !== 'add' && command !== 'remove')) {
  console.error(`flow-comments (add|remove) [-h|--help] [--spaceBefore] [--spaceInside] [files...]`);
  process.exit(1);
}

options.command = command === 'add' ? addFlowComments : removeFlowComments;

if (filenames.length > 0) {
  walk(filenames, options);
} else {
  processStdin(options)
    .then(function(result) {
      process.stdout.write(result);
    })
    .catch(function(error) {
      console.error(error);
      process.exit(1);
    });
}
