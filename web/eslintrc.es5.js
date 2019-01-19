// @flow
module.exports = {
  parserOptions: {
    ecmaVersion: 5,
  },

  extends: ['eslint:recommended', 'airbnb-base/legacy'],

  rules: {
    // Error in airbnb style
    'react/require-extension': 0,

    // airbnb style overrides
    eqeqeq: ['error', 'allow-null'],
    'no-trailing-spaces': 2,
    'space-before-function-paren': [2, 'never'],

    // We're significantly more permissive
    'func-names': 0,
    'max-len': 0,
    'no-nested-ternary': 0,
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'vars-on-top': 0,
    'default-case': 0,
    'no-else-return': 0,
    'no-cond-assign': [2, 'except-parens'],
    'no-use-before-define': [2, { functions: false, classes: true }],
    'no-shadow': 0,
    'newline-per-chained-call': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'no-console': 0,
    'linebreak-style': 0,
    'no-loop-func': 0,
    'object-shorthand': 0,
    'prefer-template': 0,
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false,
      },
    ],
    'no-continue': 0,
    'quote-props': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'no-path-concat': 0,
    'new-cap': 0,
    'no-mixed-operators': [
      2,
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'function-paren-newline': 0,
    'no-plusplus': 0,
    'wrap-iife': 0,
    indent: 0, // Covered by Prettier
    'no-tabs': 0,
    'no-prototype-builtins': 0,
  },
};
