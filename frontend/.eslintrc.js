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
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-no-bind': 'off',
    // TODO:
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/prefer-tag-over-role': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',

    'no-eq-null': 'off',
    eqeqeq: 'off',
    'react/no-unstable-nested-components': 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'no-restricted-syntax': 'off',
    'react/no-array-index-key': 'off',
    '@typescript-eslint/init-declarations': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
};
