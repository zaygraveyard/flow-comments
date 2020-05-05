import MagicString from 'magic-string';

const FLOW_COMMENT_REGEX = /^\s*(::|flow-include\s)\s*/g;
const FLOW_SHORT_COMMENT_REGEX = /^\s*:/;

export function unwrapMagicString(
  { source, ast, result },
  { spaceInside } = {},
) {
  for (const comment of ast.comments) {
    if (
      comment.type === 'CommentBlock' &&
      (FLOW_COMMENT_REGEX.test(comment.value) ||
        FLOW_SHORT_COMMENT_REGEX.test(comment.value))
    ) {
      let value = comment.value;

      value = value.slice(FLOW_COMMENT_REGEX.lastIndex);
      if (spaceInside) {
        value = value.replace(/ $/g, '');
      }
      value = value.replace(/\*-\//g, '*/').replace(/\*-ESCAPED\//g, '*-/');
      result.overwrite(comment.start, comment.end, value);
      FLOW_COMMENT_REGEX.lastIndex = 0;
    }
  }
  return { source, ast, result };
}

export default function ({ source, ast }, options = {}) {
  const result = new MagicString(source);

  unwrapMagicString({ source, ast, result }, options);
  return result.toString();
}
