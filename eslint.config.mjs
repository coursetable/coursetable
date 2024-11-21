// Encountered any problem? Read https://jc-verse.github.io/js-style-guide
// for more information.

// @ts-check

import jcRules from 'eslint-config-jc';

// @ts-expect-error: no typings yet
import cssModulesPlugin from 'eslint-plugin-css-modules';

// @ts-expect-error: no typings yet
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...jcRules({
    typescriptTypeCheck: true,
    node: ['api/**/*'],
    react: ['frontend/**/*'],
  }),
  {
    ignores: [
      'frontend/src/generated/',
      'frontend/src/queries/graphql-queries.ts',
      'frontend/build',
      'patches/',
      'api/src/**/*.queries.ts',
      'api/src/graphql-types.ts',
      '**/graphql-codegen.ts',
    ],
  },
  {
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'css-modules': cssModulesPlugin,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'react-compiler': reactCompiler,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            './tools/**/*',
            './frontend/vite.config.ts',
            './eslint.config.mjs',
          ],
        },
      ],
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
      'react/jsx-uses-react': 'off',
      'react/no-array-index-key': 'off',
      'react-compiler/react-compiler': 'error',
      // TODO: we should eventually get rid of `in` operator
      'no-restricted-syntax': 'off',
    },
  },
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
);
