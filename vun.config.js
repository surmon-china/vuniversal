module.exports = {
  universal: false,
  // clientEntry: './src/main.js',
  clientEntry: './src/main',
  template: './src/app.html',
  dev: {
    // verbose: true
  },
  // inspect: true,
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
