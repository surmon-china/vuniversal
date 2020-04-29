
module.exports = {
  universal: false,
  prerender: {
    routes: ['/', '/nested', '/users/5']
  },
  build: {
    css: {
      extract: true
    }
  }
}
