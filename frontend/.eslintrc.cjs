module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  ignorePatterns: ['node_modules/bip39'],
  plugins: ['ember'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
  },
  globals: {
    Buffer: true,
    Promise: true,
  },
  rules: {
    'no-console': 'off',
  },
  overrides: [
    // node files
    {
      files: ['testem.js', 'ember-cli-build.js', 'config/**/*.js', 'lib/*/index.js'],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
