// Encountered any problem? Read https://jc-verse.github.io/js-style-guide
// for more information.

module.exports = {
  root: true,
  extends: [
    'jc/base',
    'jc/regex',
    'jc/typescript',
    'jc/typescript-typecheck',
    'jc/import',
    'jc/node',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // TODO:
  },
};
