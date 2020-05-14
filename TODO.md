# TODO

### CLI
  - [x] Build with tsc & abc
  - [x] Webpack5
      - [x] Remove cache-loader
      - [x] [Upgrade](https://juejin.im/post/5df5cdf66fb9a0161a0c3092)
      - [x] [ModuleFederationPlugin](https://juejin.im/post/5eb382c26fb9a04388075b45?utm_source=gold_browser_extension)
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
  - [ ] modern support
  - [ ] Jest support
  - [ ] init script
  - [ ] server boundle `require.resolveWeak` [FYI](https://github.com/faceyspacey/react-universal-component)
  - [ ] server boundle async to html [FYI](https://github.com/jamiebuilds/react-loadable)
  - ~~autofix (cache-loader)~~
  - ~~autofix (pnp-loader)~~

### Vuniversal
  - [ ] Meta (vue-meta?)
  - [ ] universal 404 context
  - [ ] universal cache
  - [ ] `no-prerender` component
  - [ ] `client-only` component
  - [ ] `only-run` component?
