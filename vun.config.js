module.exports = {
  universal: true,
  clientEntry: './src/main',
  template: './src/app.html',
  prerender: {
    fallback: true,
    routes: [
      '/',
      // '/naivebayes',
      // '/vue-awesome-swiper',
      // '/vue-quill-editor',
      // '/vue-video-player',
      // '/vue-codemirror',
      // '/vue-touch-ripple',
      // '/vue-drag-zone'
    ]
  },
  build: {
    css: {
      styleResources: {
        scss: ['./src/assets/styles/init.scss']
      }
    }
  }
}
