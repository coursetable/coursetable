// Encountered any problem? Read https://jc-verse.github.io/js-style-guide
// for more information.

module.exports = {
  root: true,
  extends: ['jc', 'jc/typescript-typecheck'],
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
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-no-bind': 'off',
    // TODO: needs a lot more a11y audits
    'jsx-a11y/anchor-ambiguous-text': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/prefer-tag-over-role': 'off',
    'react/no-array-index-key': 'off',
    // TODO: until we have better types
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    // TODO: we should eventually get rid of `in` operator
    'no-restricted-syntax': 'off',
  },
};
