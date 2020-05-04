module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/react',
    'plugin:@getify/proper-arrows/getify-says',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    // Possible Errors

    // 'for-direction': 'error',                       // in eslint:recommended
    // 'getter-return': 'error',                       // in eslint:recommended
    // 'no-async-promise-executor': 'error',           // in eslint:recommended
    'no-await-in-loop': 'warn',
    // 'no-compare-neg-zero': 'error',                 // in eslint:recommended
    // 'no-cond-assign': 'error',                      // in eslint:recommended
    'no-console': 'off',
    'no-constant-condition': ['error', {checkLoops: false}], // in eslint:recommended
    // 'no-control-regex': 'error',                    // in eslint:recommended
    // 'no-debugger': 'error',                         // in eslint:recommended
    // 'no-dupe-args': 'error',                        // in eslint:recommended
    // 'no-dupe-keys': 'error',                        // in eslint:recommended
    // 'no-duplicate-case': 'error',                   // in eslint:recommended
    // 'no-empty': 'error',                            // in eslint:recommended
    // 'no-empty-character-class': 'error',            // in eslint:recommended
    // 'no-ex-assign': 'error',                        // in eslint:recommended
    // 'no-extra-boolean-cast': 'error',               // in eslint:recommended
    'no-extra-parens': ['error', 'functions'],
    // 'no-extra-semi': 'error',                       // in eslint:recommended
    // 'no-func-assign': 'error',                      // in eslint:recommended
    'no-inner-declarations': ['error', 'both'], // in eslint:recommended
    // 'no-invalid-regexp': 'error',                   // in eslint:recommended
    // 'no-irregular-whitespace': 'error',             // in eslint:recommended
    // 'no-misleading-character-class': 'error',       // in eslint:recommended
    // 'no-obj-calls': 'error',                        // in eslint:recommended
    // 'no-prototype-builtins': 'error',               // in eslint:recommended
    // 'no-regex-spaces': 'error',                     // in eslint:recommended
    // 'no-sparse-arrays': 'error',                    // in eslint:recommended
    'no-template-curly-in-string': 'error',
    // 'no-unexpected-multiline': 'error',             // in eslint:recommended
    // 'no-unreachable': 'error',                      // in eslint:recommended
    // 'no-unsafe-finally': 'error',                   // in eslint:recommended
    // 'no-unsafe-negation': 'error',                  // in eslint:recommended
    // 'require-atomic-updates': 'error',              // in eslint:recommended
    // 'use-isnan': 'error',                           // in eslint:recommended
    // 'valid-typeof': 'error',                        // in eslint:recommended

    // Best Practices

    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'off',
    complexity: 'off',
    'consistent-return': 'error',
    curly: 'error',
    'default-case': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'max-classes-per-file': 'off',
    'no-alert': 'warn',
    'no-caller': 'error',
    // 'no-case-declarations': 'error',                // in eslint:recommended
    'no-div-regex': 'off',
    'no-else-return': 'off',
    'no-empty-function': [
      'error',
      {
        allow: [
          'functions',
          'generatorFunctions',
          'methods',
          'generatorMethods',
        ],
      },
    ],
    // 'no-empty-pattern': 'error',                    // in eslint:recommended
    'no-eq-null': 'off', // handled by 'eqeqeq'
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    // 'no-fallthrough': 'error',                      // in eslint:recommended
    'no-floating-decimal': 'off',
    // 'no-global-assign': 'error',                    // in eslint:recommended
    'no-implicit-coercion': ['error', {allow: ['!!']}],
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    // 'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': ['off', {ignore: [0, 1, 2]}],
    'no-multi-spaces': 'off',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    // 'no-octal': 'error',                            // in eslint:recommended
    'no-octal-escape': 'error',
    'no-param-reassign': 'off',
    'no-proto': 'error',
    // 'no-redeclare': 'error',                        // in eslint:recommended
    'no-restricted-properties': 'off',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    // 'no-self-assign': 'error',                      // in eslint:recommended
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    // 'no-unused-labels': 'error',                    // in eslint:recommended
    'no-useless-call': 'error',
    // 'no-useless-catch': 'error',                    // in eslint:recommended
    'no-useless-concat': 'error',
    // 'no-useless-escape': 'error',                   // in eslint:recommended
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-warning-comments': 'warn',
    // 'no-with': 'error',                             // in eslint:recommended
    'prefer-promise-reject-errors': 'error',
    radix: 'error',
    'require-await': 'error',
    'vars-on-top': 'warn',
    'wrap-iife': ['error', 'outside'],
    yoda: ['error', 'never', {exceptRange: true}],

    // Strict Mode

    strict: 'error',

    // Variables

    'init-declarations': 'off',
    // 'no-delete-var': 'error',                       // in eslint:recommended
    'no-label-var': 'error',
    'no-restricted-globals': 'off',
    'no-shadow': 'warn',
    // 'no-shadow-restricted-names': 'error',          // in eslint:recommended
    // 'no-undef': 'error',                            // in eslint:recommended
    'no-undef-init': 'error',
    'no-undefined': 'off',
    'no-unused-vars': ['error', {args: 'none'}], // in eslint:recommended
    'no-use-before-define': ['error', 'nofunc'],

    // Node.js and CommonJS

    'callback-return': 'off',
    'global-require': 'off',
    'handle-callback-err': 'warn',
    'no-buffer-constructor': 'error',
    'no-mixed-requires': 'off',
    'no-new-require': 'off',
    'no-path-concat': 'off',
    'no-process-env': 'off',
    'no-process-exit': 'error',
    'no-restricted-modules': 'off',
    'no-sync': 'off',

    // Stylistic Issues

    'array-bracket-newline': ['error', "consistent"],
    'array-bracket-spacing': 'error',
    'array-element-newline': 'off',
    'block-spacing': 'error',
    'brace-style': ['off', '1tbs'], // or 'allman'
    camelcase: ['warn', {properties: 'never'}],
    'capitalized-comments': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', {before: false, after: true}],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    // 'consistent-this': ['warn', 'self'],
    'eol-last': ['error', 'always'],
    'func-call-spacing': 'error',
    'func-name-matching': 'off',
    'func-names': 'off',
    'func-style': ['error', 'declaration', {allowArrowFunctions: true}],
    'function-paren-newline': ['error', 'consistent'],
    'id-blacklist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'implicit-arrow-linebreak': ['off', 'beside'],
    indent: 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'key-spacing': 'off',
    'keyword-spacing': ['error', {before: true, after: true}],
    'line-comment-position': 'off',
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': 'off',
    'lines-between-class-members': 'off',
    'max-depth': ['warn', 5],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignorePattern: '^(?:RegExp\\(.*?\\))|(?:/.*?/.*)$',
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      },
    ],
    'max-lines': [
      'error',
      {
        max: 1000,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines-per-function': 'off',
    'max-nested-callbacks': ['error', 5],
    'max-params': ['off', 6],
    'max-statements': 'off',
    'max-statements-per-line': ['error', {max: 1}],
    'multiline-comment-style': 'off',
    'multiline-ternary': 'off',
    'new-cap': [
      'error',
      {
        capIsNewExceptions: ['Gator'],
        // Only if the name contains a lower case letter
        capIsNewExceptionPattern: '^[A-Z][^a-z]+$',
      },
    ],
    'new-parens': 'error',
    'newline-per-chained-call': 'off',
    'no-array-constructor': 'error',
    'no-bitwise': ['error', {int32Hint: true}],
    'no-continue': 'off',
    'no-inline-comments': 'off',
    'no-lonely-if': 'error',
    // 'no-mixed-operators': 'warn', // incopatible with prettier
    // 'no-mixed-spaces-and-tabs': 'error',            // in eslint:recommended
    'no-multi-assign': 'error',
    'no-multiple-empty-lines': 'off',
    'no-negated-condition': 'error',
    'no-nested-ternary': 'off',
    'no-new-object': 'error',
    'no-plusplus': 'off',
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-tabs': 'error',
    'no-ternary': 'off',
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'off',
    'object-curly-newline': ['error', {consistent: true}],
    // 'object-curly-spacing': ['error', 'never'],
    'object-property-newline': 'off',
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': ['error', 'initializations'],
    'operator-assignment': ['error', 'always'],
    'operator-linebreak': [
      'error',
      'after',
      {overrides: {'?': 'before', ':': 'before'}},
    ],
    'padded-blocks': 'off',
    'padding-line-between-statements': [
      'error',
      {blankLine: 'always', prev: 'directive', next: '*'},
      {blankLine: 'any', prev: 'directive', next: 'directive'},

      {blankLine: 'always', prev: 'import', next: '*'},
      {blankLine: 'any', prev: 'import', next: 'import'},

      {blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },

      {blankLine: 'always', prev: '*', next: 'class'},
    ],
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'as-needed', {numbers: true}],
    quotes: [
      'error',
      'single',
      {avoidEscape: true, allowTemplateLiterals: false},
    ],
    // semi: ['error', 'always'],
    'semi-spacing': ['error', {before: false, after: true}],
    'semi-style': ['error', 'last'],
    'sort-keys': 'off',
    'sort-vars': 'off',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': 'off',
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error', {int32Hint: true}],
    'space-unary-ops': ['error', {words: true, nonwords: false}],
    'spaced-comment': 'off',
    'switch-colon-spacing': ['error', {before: false, after: true}],
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],
    'wrap-regex': 'off',

    // ECMAScript 6

    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    // 'constructor-super': 'error',                   // in eslint:recommended
    'generator-star-spacing': [
      'error',
      {
        before: false,
        after: true,
        anonymous: 'neither',
        method: {before: true, after: false},
      },
    ],
    // 'no-class-assign': 'error',                     // in eslint:recommended
    'no-confusing-arrow': ['error', {allowParens: true}],
    // 'no-const-assign': 'error',                     // in eslint:recommended
    // 'no-dupe-class-members': 'error',               // in eslint:recommended
    // 'no-duplicate-imports': 'error', // use 'import/no-duplicates' instead
    // 'no-new-symbol': 'error',                       // in eslint:recommended
    'no-restricted-imports': 'off',
    // 'no-this-before-super': 'error',                // in eslint:recommended
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'warn',
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    // 'require-yield': 'error',                       // in eslint:recommended
    'rest-spread-spacing': ['error', 'never'],
    'sort-imports': 'off',
    'symbol-description': 'warn',
    'template-curly-spacing': ['error', 'never'],
    'yield-star-spacing': ['error', {before: false, after: true}],

    // === Import plugin (https://github.com/benmosher/eslint-plugin-import)
    // Static analysis

    'import/no-unresolved': 'off', // in plugin:import/errors
    // 'import/named': 'error',                      // in plugin:import/errors
    // 'import/default': 'error',                    // in plugin:import/errors
    // 'import/namespace': 'error',                  // in plugin:import/errors
    'import/no-restricted-paths': 'off',
    'import/no-absolute-path': 'off',
    'import/no-dynamic-require': 'error',
    'import/no-internal-modules': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/no-self-import': 'error',
    'import/no-cycle': 'warn',
    'import/no-useless-path-segments': 'warn',
    'import/no-relative-parent-imports': 'off',
    'import/no-unused-modules': 'off',

    // Helpful warnings

    // 'import/export': 'error',                   // in plugin:import/errors
    // 'import/no-named-as-default': 'warn',       // in plugin:import/warnings
    // 'import/no-named-as-default-member': 'warn',// in plugin:import/warnings
    // 'import/no-deprecated': 'warn',             // in plugin:import/warnings
    'import/no-extraneous-dependencies': 'warn',
    'import/no-mutable-exports': 'off',

    // Module systems

    'import/unambiguous': 'off',
    'import/no-commonjs': 'error',
    'import/no-amd': 'error',
    'import/no-nodejs-modules': 'off',

    // Style guide

    'import/first': 'off',
    'import/exports-last': 'off',
    'import/no-duplicates': 'error',
    'import/no-namespace': 'off',
    'import/extensions': ['error', 'ignorePackages'],
    'import/order': 'warn',
    'import/newline-after-import': 'error',
    'import/prefer-default-export': 'off',
    'import/max-dependencies': 'off',
    'import/no-unassigned-import': 'off',
    'import/no-named-default': 'off',
    'import/no-default-export': 'off',
    'import/no-named-export': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/group-exports': 'off',
    'import/dynamic-import-chunkname': 'off',

    // === Proper Arrows (https://github.com/getify/eslint-plugin-proper-arrows)

    // in plugin:@getify/proper-arrows/getify-says
    // '@getify/proper-arrows/params': [
    //   'error',
    //   {
    //     unused: 'trailing',
    //     count: 2,
    //     length: 3,
    //     allowed: ['e', 'v', 'cb', 'fn', 'pr'],
    //   },
    // ],
    '@getify/proper-arrows/name': 'off', // in plugin:@getify/proper-arrows/getify-says
    '@getify/proper-arrows/return': ['error', {ternary: 1, chained: false}], // in plugin:@getify/proper-arrows/getify-says
    // '@getify/proper-arrows/where': 'error',                                 // in plugin:@getify/proper-arrows/getify-says
    // '@getify/proper-arrows/this': ['error', 'nested', {'no-global': true}], // in plugin:@getify/proper-arrows/getify-says
  },
  env: {
    node: true,
    es6: true,
  },
}
