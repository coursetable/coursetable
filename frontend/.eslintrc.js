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
      },
    ],
    // TODO: Eventually we want to remove these rules (and default to error).
    '@typescript-eslint/naming-convention': 'warn',
    'import/order': 'warn',
    'no-plusplus': 'warn',
    'no-nested-ternary': 'warn',
    'no-restricted-syntax': 'warn',
    'no-continue': 'warn',
    'guard-for-in': 'warn',
    'prefer-destructuring': 'warn',
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-filename-extension': 'warn', // TODO: rename all .js to .jsx
    'react/require-default-props': 'warn',
    'react/jsx-props-no-spreading': 'warn',
    'react/no-array-index-key': 'warn',
    'jsx-a11y': 'warn',
  },
};
