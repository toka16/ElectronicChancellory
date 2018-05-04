module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  // required to lint *.vue files
  plugins: ['html'],
  // add your custom rules here
  rules: {
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
    ],
    'no-console': ['warn']
  },

  globals: {}
}
