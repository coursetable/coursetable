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
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        // Too many false positives
        checksVoidReturn: false,
      },
    ],
    // TODO: until we have better types
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
};
