// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-typescript/index.js#L82
// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-typescript/vue-compiler-sfc-shim.js

// @ts-ignore
const compilerSFC = require('@vue/compiler-sfc')

module.exports = {
  parseComponent(content, options) {
    return compilerSFC.parse(content, options)
  }
}