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
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'classStaticBlock',
        'decimal',
        // 'decorators',
        'doExpressions',
        'exportDefaultFrom',
        'functionBind',
        'importAssertions',
        'moduleStringNames',
        'partialApplication',
        // 'pipelineOperator',
        'privateIn',
        // 'recordAndTuple',
        'throwExpressions',
        'topLevelAwait',
        'flow',
        'jsx',
        'v8intrinsic',
      ],
    }),
  };
}
