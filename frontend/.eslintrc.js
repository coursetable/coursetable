module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  // globals: {
  //   Atomics: 'readonly',
  //   SharedArrayBuffer: 'readonly',
  // },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
      },
    ],
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    // TODO: Eventually we want to remove these rules (and default to error).
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'warn',
    'no-restricted-syntax': 'warn',
    'no-continue': 'off',
    'no-underscore-dangle': 'warn',
    'no-lonely-if': 'warn',
    'no-param-reassign': 'warn',
    'no-return-await': 'warn',
    'guard-for-in': 'warn',
    'prefer-destructuring': 'warn',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-filename-extension': 'off', // TODO: rename all .js to .jsx
    'react/jsx-props-no-spreading': 'warn',
    'react/no-array-index-key': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
  },
};
