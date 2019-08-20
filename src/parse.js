import { parse } from '@babel/parser';

export default function parseCode(source) {
  return {
    source,
    ast: parse(source, {
      sourceType: 'unambiguous',
      plugins: ['classProperties', 'flow', 'jsx'],
    }),
  };
}
