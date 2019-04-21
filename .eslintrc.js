module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:monorepo/recommended', 'prettier'],
  plugins: ['node', 'prettier'],
  env: { es6: true, node: true },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'node/no-unpublished-require': 'off',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['packages/*/src/**/*.js'],
      rules: {
        'node/no-extraneous-require': 'error',
      },
    },
    {
      files: ['packages/*/test/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
}
