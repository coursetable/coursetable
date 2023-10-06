module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'linebreak-style': 'off',
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
  },
};
