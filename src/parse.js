import { parse } from '@babel/parser';

export default function parseCode(source) {
  return {
    source,
    ast: parse(source, {
      allowImportExportEverywhere: true,
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      allowNewTargetOutsideFunction: true,
      allowSuperOutsideMethod: true,
      allowUndeclaredExports: true,
      sourceType: 'unambiguous',
      plugins: [
        'asyncDoExpressions',
        'decimal',
        'decorators',
        'decoratorAutoAccessors',
        'deferredImportEvaluation',
        'destructuringPrivate',
        'doExpressions',
        'explicitResourceManagement',
        'exportDefaultFrom',
        'functionBind',
        'functionSent',
        'importAttributes',
        // 'importAssertions',
        'importReflection',
        'moduleBlocks',
        // 'optionalChainingAssign',
        'partialApplication',
        // 'pipelineOperator',
        'recordAndTuple',
        'sourcePhaseImports',
        'throwExpressions',
        'flow',
        'jsx',
        'v8intrinsic',
      ],
    }),
  };
}
