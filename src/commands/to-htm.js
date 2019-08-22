import MagicString from 'magic-string';
import traverse from '@babel/traverse';
import t from '@babel/types';

export function toHTMMagicString(
  { source, ast, result },
  { tag = 'html', import: importOption = false } = {},
) {
  const tagRoot = tag.split('.')[0];
  const importDeclaration = tagImport(importOption);
  const FRAGMENT_EXPR = dottedIdentifier('React.Fragment');
  let foundJSXElement = false;
  let remainingExpressions = [];

  traverse(ast, {
    Program: {
      exit(path) {
        if (
          foundJSXElement &&
          importDeclaration &&
          !path.scope.hasBinding(tagRoot)
        ) {
          let start = path.node.start;

          if (t.isImportDeclaration(path.node.body[0])) {
            start = path.node.body[0].start;
          }
          result.appendRight(start, `${importDeclaration}\n`);
        }
      },
    },

    JSXElement: jsxVisitorHandler,
    JSXFragment: jsxVisitorHandler,
  });

  return { source, ast, result };

  function tagImport(imp) {
    if (imp === false) {
      return null;
    }
    const { module, export: export_ } =
      typeof imp === 'string'
        ? {
            module: imp,
            export: null,
          }
        : imp;

    let specifier;

    if (export_ === '*') {
      specifier = `* as ${tagRoot}`;
    } else if (export_ === 'default') {
      specifier = tagRoot;
    } else if (!export_ || export_ === tagRoot) {
      specifier = `{${tagRoot}}`;
    } else {
      specifier = `{${export_} as ${tagRoot}}`;
    }
    return `import ${specifier} from ${quoteString(module, '"')};`;
  }

  function dottedIdentifier(keypath) {
    const path = keypath.split('.');
    let out;

    for (let i = 0; i < path.length; i++) {
      const ident = t.identifier(path[i]);

      out = i === 0 ? ident : t.memberExpression(out, ident);
    }
    return out;
  }

  function escapedText(text) {
    if (text.indexOf('<') < 0) {
      return text;
    }
    return `\${"${text}"}`;
  }

  function quoteString(string, quote) {
    return quote + string.replace(new RegExp(quote, 'g'), `\\${quote}`) + quote;
  }

  function isFragmentName(node) {
    return t.isNodesEquivalent(FRAGMENT_EXPR, node);
  }

  function isComponentName(node) {
    return !t.isIdentifier(node) || node.name.match(/^[$_A-Z]/);
  }

  function getNameExpr(node) {
    if (!t.isJSXMemberExpression(node)) {
      return t.identifier(node.name);
    }
    return t.memberExpression(
      getNameExpr(node.object),
      t.identifier(node.property.name),
    );
  }

  function processNode(node, path) {
    const open = node.openingElement || node.openingFragment;
    const close = node.closingElement || node.closingFragment;
    const children = node.children;
    const isFragment =
      t.isJSXOpeningFragment(open) || isFragmentName(getNameExpr(open.name));

    if (isFragment) {
      result.remove(open.start, open.end);
      if (close) {
        result.remove(close.start, close.end);
      }
    } else if (isComponentName(getNameExpr(open.name))) {
      result.appendRight(open.name.start, '${');
      result.appendLeft(open.name.end, '}');
      if (close) {
        result.appendRight(close.name.start, '${');
        result.appendLeft(close.name.end, '}');
      }
    }

    if (open.attributes) {
      for (let i = 0; i < open.attributes.length; i++) {
        const attr = open.attributes[i];

        if (t.isJSXSpreadAttribute(attr)) {
          const spreadOperatorIndex = source.indexOf('...', attr.start);

          result.appendRight(attr.start, '...$');
          result.remove(spreadOperatorIndex, spreadOperatorIndex + 3);
          continue;
        }
        const val = attr.value;

        if (t.isJSXExpressionContainer(val)) {
          result.appendRight(val.start, '$');
          remainingExpressions.push(val.expression);
        } else if (val) {
          const quote = source[val.start];

          if (!val.value.match(/^.*$/u)) {
            result.overwrite(val.start, val.end, `\${\`${val.value}\`}`);
          } else if (val.value.indexOf(quote) === -1) {
            result.overwrite(val.start + 1, val.end - 1, val.value);
          } else {
            result.overwrite(
              val.start,
              val.end,
              `\${${quoteString(val.value, quote)}}`,
            );
          }
        }
      }
    }

    if (children) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (t.isJSXExpressionContainer(child)) {
          result.appendRight(child.start, '$');
          child = child.expression;
        }

        if (t.isJSXText(child)) {
          // @todo - expose `whitespace: true` option?
          result.overwrite(child.start, child.end, escapedText(child.value));
        } else if (t.isJSXElement(child)) {
          processNode(child);
        } else if (t.isJSXEmptyExpression(child)) {
          result.appendRight(child.start, '""');
        } else {
          remainingExpressions.push(child);
        }
      }
    }
  }

  function jsxVisitorHandler(path) {
    processNode(path.node, path);
    result.appendRight(path.node.start, `${tag}\``);
    result.appendLeft(path.node.end, '`');
    path.replaceWithMultiple(
      remainingExpressions.map(function(expression) {
        return t.expressionStatement(expression);
      }),
    );
    remainingExpressions = [];
    foundJSXElement = true;
  }
}

export default function({ source, ast }, options = {}) {
  const result = new MagicString(source);

  toHTMMagicString({ source, ast, result }, options);
  return result.toString();
}
