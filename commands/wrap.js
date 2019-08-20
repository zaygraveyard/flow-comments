const MagicString = require('magic-string').default;
const traverse = require('@babel/traverse').default;

const WHITE_SPACE_REGEX = /\s/;

function wrapMagicString({source, ast, result}, {spaceBefore, spaceInside} = {}) {
  const insideSpace = spaceInside ? ' ' : '';
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
              ? getStartOfNode(specifiers[index + 1])
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

  return {source, ast, result};

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
  function getStartOfNode(node) {
    return node.leadingComments && node.leadingComments.length > 0
      ? node.leadingComments[0].start
      : node.start;
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

module.exports = function({source, ast}, options = {}) {
  const result = new MagicString(source);
  wrapMagicString({source, ast, result}, options);
  return result.toString();
};
module.exports.wrapMagicString = wrapMagicString;
