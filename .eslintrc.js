module.exports = {
  extends: [
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'vue/valid-v-slot': 'off',
    'vue/component-tags-order': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'indent': 'off',
    'space-before-function-paren': 'off',
    'arrow-parens': 'off',
    'quotes': 'off',
    'import/order': 'off',
    'no-console': 'off'
  }
}
