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
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',

    'no-eq-null': 'off',
    eqeqeq: 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'no-restricted-syntax': 'off',
    '@typescript-eslint/init-declarations': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
};
