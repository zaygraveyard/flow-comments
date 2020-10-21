import { parse } from '@babel/parser';

export default function parseCode(source) {
  return {
    source,
    ast: parse(source, {
      allowImportExportEverywhere: true,
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      allowUndeclaredExports: true,
      sourceType: 'unambiguous',
      plugins: [
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        // 'decorators',
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
        // 'pipelineOperator',
        'throwExpressions',
        'topLevelAwait',
        'flow',
        'jsx',
        'v8intrinsic',
      ],
    }),
  };
}
