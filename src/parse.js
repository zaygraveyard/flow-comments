import { parse } from '@babel/parser';

export default function parseCode(source) {
  return {
    source,
    ast: parse(source, {
      sourceType: 'unambiguous',
      plugins: [
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        'throwExpressions',
        'flow',
        'jsx',
      ],
    }),
  };
}
