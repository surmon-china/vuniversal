
module.exports = {
  universal: true,
  // host: localhost
  port: 3000,
  // eslint: {},
  // typescript: {},
  webpack(config) {
    // alias
    // config.resolve.alias = Object.assign({}, config.resolve.alias, {
    //   vue$: 'vue/dist/vue.esm.js',
    // });

    // typescript
    // console.log('-------arguments', arguments)
    // config = require('razzle-plugin-typescript')(...arguments)
    // config = require('./vuniversal/packages/webpack-typescript')(...arguments)

    // Eslint
    // config = require('./vuniversal/packages/webpack-eslint')(config)
    return config
  }
}
