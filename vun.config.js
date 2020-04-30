
module.exports = {
  universal: false,
  clientEntry: './src/main',
  template: './src/app.html',
  // prerender: {
  //   routes: ['/', '/nested', '/users/5']
  // },
  build: {
    css: {
      extract: true,
      styleResources: {
        scss: ['./src/assets/styles/init.scss']
      }
    }
  }
}
