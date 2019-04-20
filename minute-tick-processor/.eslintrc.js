module.exports = {
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  plugins: ['node', 'prettier'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'node/no-unpublished-require': 'off',
    'no-console': 'off',
  },
}
