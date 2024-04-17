// Encountered any problem? Read https://jc-verse.github.io/js-style-guide
// for more information.

module.exports = {
  root: true,
  extends: ['jc', 'jc/typescript-typecheck', 'jc/node'],
  plugins: ['css-modules'],
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        // Too many false positives
        checksVoidReturn: false,
      },
    ],
    'css-modules/no-unused-class': 'error',
    'css-modules/no-undef-class': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'sibling', 'parent', 'index'],
        'newlines-between': 'ignore',
        pathGroups: [
          // Used extensively and are critical to our infra
          {
            pattern: '{react,react-dom/*,react-router-dom,express}',
            group: 'external',
            position: 'before',
          },
          // Important utilities but not as important
          {
            pattern:
              '{clsx,react-icons,react-icons/**,react-bootstrap,react-bootstrap/**,@sentry/*}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: './**/*.css',
            group: 'index',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        // Treat pathGroups as distinct groups, so they won't be sorted with
        // other modules (we don't enforce blank lines for this reason)
        distinctGroup: true,
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-no-bind': 'off',
    // TODO: needs a lot more a11y audits
    'jsx-a11y/anchor-ambiguous-text': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/prefer-tag-over-role': 'off',
    'react/no-array-index-key': 'off',
    // TODO: we should eventually get rid of `in` operator
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: ['frontend/**/*'],
      rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'lodash',
                message:
                  'Lodash is too heavy to be allowed in frontend. Write your own utility, or import a standalone package like lodash.debounce instead.',
              },
            ],
            patterns: [
              {
                group: ['luxon', 'moment'],
                message:
                  "Do you really need a Date library? Consider hand-rolling your own utilities. Look around for examples. We don't need anything complex because we will only possibly deal with three time zones: Yale, UTC, and user device. Maybe be on the lookout for https://tc39.es/proposal-temporal/docs/",
              },
            ],
          },
        ],
      },
    },
  ],
};
