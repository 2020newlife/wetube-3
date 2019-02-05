module.exports = {
  extends: [ 'airbnb-base', 'prettier' ],
  plugins: [ 'prettier' ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': [ 'error' ],
    'func-names': 'off'
  },
  env: {
    browser: true
  }
};
