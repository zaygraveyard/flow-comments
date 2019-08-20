import MagicString from 'magic-string';

const FLOW_COMMENT_REGEX = /^\s*(::|flow-include\s)\s*/g;
const FLOW_SHORT_COMMENT_REGEX = /^\s*:/;

export function unwrapMagicString(
  { source, ast, result },
  { spaceInside } = {},
) {
  for (const comment of ast.comments) {
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
          .replace(/\*-ESCAPED\//g, '*-/'),
      );
      FLOW_COMMENT_REGEX.lastIndex = 0;
    }
  }
  return { source, ast, result };
}

export default function({ source, ast }, options = {}) {
  const result = new MagicString(source);

  unwrapMagicString({ source, ast, result }, options);
  return result.toString();
}
