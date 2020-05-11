# Changelog
All notable changes to this project will be documented in this file.

### TODO

- CLI
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
  - [x] server prod optimize
  - [ ] assets hash: number -> id | name
  - [ ] prerender option e.g. wait
  - [ ] cors option support
  - [ ] OptimizeCSSAssetsPlugin
  - [ ] modern support
  - [ ] analyze support
  - [ ] Jest support
  - [ ] init script
  - ~~autofix (cache-loader)~~
  - ~~autofix (pnp-loader)~~
- Vuniversal
  - [ ] Meta (vue-meta?)
  - [ ] universal 404 context
  - [ ] universal cache

### 0.0.10 (2020-05-08)

**NIP**
- Logo

**Upgrade**
- Webpack 5

### 0.0.5 (2020-05-08)

**Fix**
- Eslint
- lint

### 0.0.3 (2020-05-08)

**Fix**
- Add `clean-webpack-plugin`
- Add `break` for `scripts`

### 0.0.2 (2020-05-08)

**Feature**
- Support SPA mode
