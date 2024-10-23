import MagicString from 'magic-string';
import traverse from '@babel/traverse';
import parse from '../parse.js';
import unwrap from './unwrap.js';

const WHITE_SPACE_REGEX = /\s/;
const NEW_LINE_REGEX = /[\n\r]+/;
const NEW_LINE_AT_START_REGEX = /^(\n|\r|(\n\r)|(\r\n))/g;
const NEW_LINE_AT_END_REGEX = /(\n|\r|(\n\r)|(\r\n))$/;

const NEW_LINE_SEARCH_OFFSET = 4;

export function removeMagicString({ source, ast, result }, options = {}) {
  source = result.toString();
  source = unwrap({ source, ast }, options);
  ast = parse(source).ast;
  result = new MagicString(source);
  traverse.default(ast, {
    TypeCastExpression(path) {
      removeFlowAtPath(path.get('typeAnnotation'));
      path.replaceWith(path.get('expression'));
    },

    // support function a(b?) {}
    Identifier(path) {
      const { node } = path;

      if (node.typeAnnotation) {
        const start = node.optional
          ? getStartOfToken(node, '?')
          : node.typeAnnotation.start;

        removeFlow(start, node.typeAnnotation.end);
        path.get('typeAnnotation').remove();
      } else if (node.optional) {
        const start = getStartOfToken(node, '?');

        removeFlow(start, start + 1);
      }
    },

    // support for `class X { foo: string }`
    ClassProperty(path) {
      if (!path.node.value) {
        removeFlowAtPath(path);
        path.remove();
      }
    },

    // support `import type A` and `import typeof A`
    ImportDeclaration(path) {
      const { node } = path;

      if (isTypeImportNode(node) || node.specifiers.length === 0) {
        return;
      }

      const specifiers = node.specifiers;

      node.specifiers = specifiers.filter(isNormalImportNode);
      if (node.specifiers.length === 0) {
        removeFlowAtPath(path);
        path.remove();
        return;
      }

      let start = NaN;
      let end;

      specifiers.forEach(function (specifier, index) {
        if (isTypeImportNode(specifier)) {
          if (isNaN(start)) {
            start = specifier.start;
          }
          if (index < specifiers.length - 1) {
            end = getStartOfNode(specifiers[index + 1]);
            if (NEW_LINE_REGEX.test(source.substring(start, end))) {
              end = getStartOfToken(specifier, ',') + 1;
            }
          } else {
            end = specifier.end;
          }
        } else if (!isNaN(start)) {
          removeFlow(start, end);
          start = NaN;
        }
      });
      if (!isNaN(start)) {
        const lastSpecifier = specifiers[specifiers.length - 1];
        const indexOfFollowingComma = getStartOfToken(lastSpecifier, ',');
        const hasTrailingComma =
          indexOfFollowingComma !== -1 &&
          indexOfFollowingComma < getStartOfToken(lastSpecifier, '}');

        if (hasTrailingComma) {
          end = indexOfFollowingComma + 1;
        } else {
          const lastNormalSpecifier = findLast(specifiers, isNormalImportNode);

          if (lastNormalSpecifier) {
            start = getStartOfToken(lastNormalSpecifier, ',');
          }
        }
        removeFlow(start, end);
      }
    },

    Flow(path) {
      removeFlowAtPath(path);
      path.remove();
    },

    Class(path) {
      const { node } = path;

      if (node.typeParameters) {
        removeFlowAtPath(path.get('typeParameters'));
        path.get('typeParameters').remove();
      }
      if (node.superTypeParameters) {
        removeFlowAtPath(path.get('superTypeParameters'));
        path.get('superTypeParameters').remove();
      }
      if (node.implements) {
        const start = getStartOfToken(node.id, 'implements');
        const end = node.implements[node.implements.length - 1].end;

        removeFlow(start, end);
        if (
          WHITE_SPACE_REGEX.test(source[start - 1]) &&
          WHITE_SPACE_REGEX.test(source[end])
        ) {
          removeFlow(start - 1, start);
        }
        delete node.implements;
      }
    },
  });

  return { source, ast, result };

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

  function removeFlow(start, end) {
    const startsAtStartOfLine =
      start === 0 ||
      NEW_LINE_AT_END_REGEX.test(
        source.slice(start - NEW_LINE_SEARCH_OFFSET, start),
      );
    const endsAtEndOfLine =
      end === source.length ||
      NEW_LINE_AT_START_REGEX.test(
        source.slice(end, end + NEW_LINE_SEARCH_OFFSET),
      );

    if (startsAtStartOfLine && endsAtEndOfLine) {
      end += NEW_LINE_AT_START_REGEX.lastIndex;
    }
    NEW_LINE_AT_START_REGEX.lastIndex = 0;
    result.remove(start, end);
  }
  function removeFlowAtPath({ node: { start, end } }) {
    removeFlow(start, end);
  }

  function isTypeImportNode(node) {
    return node.importKind === 'type' || node.importKind === 'typeof';
  }
  function isNormalImportNode(node) {
    return !isTypeImportNode(node);
  }

  function findLast(array, predicate, thisArg) {
    let i = array.length;

    while (i--) {
      const value = array[i];

      if (predicate.call(thisArg, value, i, array)) {
        return value;
      }
    }
    return undefined;
  }
}

export default function ({ source, ast }, options = {}) {
  let result = new MagicString(source);

  result = removeMagicString({ source, ast, result }, options).result;
  return result.toString();
}
