
module.exports = {
  universal: false,
  clientEntry: './src/main',
  template: './app.html',
  // prerender: {
  //   routes: ['/', '/nested', '/users/5']
  // },
  build: {
    css: {
      extract: true
    }
  }
}
