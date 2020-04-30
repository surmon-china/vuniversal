exports.NPM_UID = 'surmon'
exports.GITHUB_UID = 'surmon-china'

exports.GITHUB_REPOSITORIEL_IDS = {
  Naivebayes: 'naivebayes',
  VueAwesomeSwiper: 'vue-awesome-swiper',
  VueQuillEditor: 'vue-quill-editor',
  VueVideoPlayer: 'vue-video-player',
  VueCodemirror: 'vue-codemirror',
  VueTouchRipple: 'vue-touch-ripple',
  VueDragZone: 'vue-drag-zone'
}

exports.ROUTES = (function() {
  const repositorielIds = exports.GITHUB_REPOSITORIEL_IDS
  const routes = {
    Index: '/',
  }
  Object.keys(repositorielIds).forEach(repo => {
    routes[repo] = '/' + repositorielIds[repo]
  })
  return routes
}())
