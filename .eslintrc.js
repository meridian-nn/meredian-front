module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:cypress/recommended',
    'plugin:vue/recommended',
    '@nuxtjs',
    // 'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['vue', 'cypress'],

  rules: {
    'id-blacklist': 0,
    'jsdoc/require-param': 0,
    'newline-after-var': 0,
    'quote-props': 0,
    'unicorn/no-abusive-eslint-disable': 0,
    'jsx-quotes': ['error', 'prefer-single'],
    'space-before-function-paren': ['error', 'never'],
    'vue/max-len': [
      'error',
      {
        code: 120,
        template: 200,
        ignorePattern: '',
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],

    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always'
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 1,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/no-side-effects-in-computed-properties': 0
  }
}
