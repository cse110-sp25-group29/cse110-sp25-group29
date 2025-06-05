module.exports = {
  root: true,
  extends: ["standard"],  
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  globals: {
    page: 'readonly',
    browser: 'readonly'
  },
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    quotes: ['error', 'single']
  }
};
