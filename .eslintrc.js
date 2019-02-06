module.exports = {
  extends: [ 'airbnb-base', 'prettier' ],
  plugins: [ 'prettier' ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': [ 'error' ],
    'func-names': 'off',
    'no-use-before-define': 'off'
  },
  env: {
    browser: true
  }
};
