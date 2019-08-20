const MagicString = require('magic-string').default;

const FLOW_COMMENT_REGEX = /^\s*(::|flow-include\s)\s*/g;
const FLOW_SHORT_COMMENT_REGEX = /^\s*:/;

function removeMagicString({source, ast, result}, {spaceInside} = {}) {
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
  return {source, ast, result};
}

module.exports = function({source, ast}, options = {}) {
  const result = new MagicString(source);
  removeMagicString({source, ast, result}, options);
  return result.toString();
};
module.exports.removeMagicString = removeMagicString;
