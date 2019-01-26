module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error'],
  },
  env: {
    "browser": true
  }
};
