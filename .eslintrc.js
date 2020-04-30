module.exports = {
  extends: [
    'plugin:vue/vue3-recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': 'off',
    'vue/component-tags-order': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/max-attributes-per-line': ['warn', {
      singleline: 4,
      multiline: {
        max: 1,
        allowFirstLine: true
      }
    }],
    'import/order': 'off',
    'indent': 'off',
    'space-before-function-paren': 'off',
    'arrow-parens': 'off',
    'quotes': 'off',
    'no-console': 'off'
  }
}
