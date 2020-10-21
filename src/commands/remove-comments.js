import MagicString from 'magic-string';

const NEW_LINE_AT_START_REGEX = /^(\n|\r|(\n\r)|(\r\n))/g;
const NEW_LINE_AT_END_REGEX = /(\n|\r|(\n\r)|(\r\n))$/;

const NEW_LINE_SEARCH_OFFSET = 4;

export function removeCommentsMagicString({ source, ast, result }) {
  for (const comment of ast.comments) {
    const { start } = comment;
    let { end } = comment;
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
  return { source, ast, result };
}

export default function ({ source, ast }) {
  const result = new MagicString(source);

  removeCommentsMagicString({ source, ast, result });
  return result.toString();
}
