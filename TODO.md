# TODO

### CLI
  - [x] Build with tsc & abc
  - [x] Webpack5
      - [x] Remove cache-loader
      - [x] [Upgrade](https://juejin.im/post/5df5cdf66fb9a0161a0c3092)
      - [x] [ModuleFederationPlugin](https://juejin.im/post/5eb382c26fb9a04388075b45?utm_source=gold_browser_extension)
      - ~~autofix (cache-loader)~~
      - ~~autofix (pnp-loader)~~
  - [x] block by vue-loader & webpack 5
  - [x] fix bugs with html-webpack-plugin@^4.0.0-beta.11
  - [x] helper command
  - [x] fix prerender plugin with webpack 5
  - [x] wds message
  - [x] notifier logo & texts
  - [x] logger auto line
  - [x] asynv chunk number: -> id | name
  - [x] cors & ~~integrity~~ option support
  - [x] ~~integrity has bug with preload~~ [Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
  - [x] prerender option e.g. wait
  - [x] OptimizeCSSAssetsPlugin
  - [x] extractOptions (duplicates) & OptimizeCSSAssetsPlugin (map) [so](https://stackoverflow.com/questions/52564625/cssnano-doesnt-remove-duplicates)
  - [x] server prod optimize (max chunk length = 1)
  - [x] analyze support [options](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)
  - [x] babel config
  - [x] prerender with ssr
  - [x] bin script
  - [x] jest support (example)
  - [ ] mocha support (example) & webpack.config.js interface with root
    - [ ] [FYI](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-unit-mocha/index.js#L59)
    - [ ] [FYI](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/app.js#L37)
  - [ ] ssr app.template.html copy to dist & default build spa.html
  - [WIP] html (cors/ext/preload/prefetch) option
    - [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin)
    - [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin)
  - [ ] [modern support](https://cli.vuejs.org/zh/guide/browser-compatibility.html#%E7%8E%B0%E4%BB%A3%E6%A8%A1%E5%BC%8F)
  - [ ] init script
  - [ ] server boundle `require.resolveWeak` [FYI](https://github.com/faceyspacey/react-universal-component)
  - [ ] server boundle async to html [FYI](https://github.com/jamiebuilds/react-loadable)

### Vuniversal
  - [ ] Meta (vue-meta?)
  - [ ] universal 404 context
  - [ ] universal cache
  - [ ] `no-prerender` component
  - [ ] `client-only` component
  - [ ] `only-run` component?
