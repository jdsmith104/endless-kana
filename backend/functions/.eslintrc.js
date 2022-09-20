/* eslint-disable quote-props */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    quoteProps: [0, 'as-needed'],
    quotes: [1, 'single'],
    'import/no-unresolved': 0,
    semi: [2, 'always'],
    'object-curly-newline': 'off',
    'max-len': [2, 150],
    'implicit-arrow-linebreak': ['off', 'error', 'below'],
    'function-paren-newline': 'off',
    'no-confusing-arrow': [
      'off',
      {
        allowParens: true,
        onlyOneSimpleParam: true,
      },
    ],
    'operator-linebreak': [0, 'warn'],
    'react/jsx-one-expression-per-line': 'off',
    'eol-last': [0, 'never'],
    'object-curly-spacing': [2, 'never'],
    '@typescript-eslint/no-var-requires': ['error'],
    indent: ['warn', 2],
  },
};
