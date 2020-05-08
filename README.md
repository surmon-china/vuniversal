# vuniversal

![vue](https://img.shields.io/badge/MADE%20WITH-VUE-42a97a?style=for-the-badge&labelColor=35495d)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/vuniversal.svg?style=for-the-badge)](https://github.com/surmon-china/vuniversal/stargazers)
[![npm](https://img.shields.io/npm/v/vuniversal?color=c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/vuniversal)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/vuniversal/Publish?label=publish&style=for-the-badge)](https://github.com/surmon-china/vuniversal/actions?query=workflow%3APublish)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/vuniversal.svg?style=for-the-badge)](https://github.com/surmon-china/vuniversal/issues)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/surmon-china/vuniversal/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/vuniversal.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vuniversal)

Create vue (3) universal web applications quickly.

---

### Usage

``` bash
yarn add vuniversal
```

**package.json**

```json
"scripts": {
  "dev": "vun",
  "build": "vun build",
  "test": "vun test",
  "lint": "eslint --ext .js,.ts,.vue src"
}
```

### Config

**vun.config.js**

```js
module.exports = {universal: true,
  modern: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  template: VUN_DEFAULT_HTML_TEMPLATE,
  prerender: false,
  inspect: false,
  env: {},
  dir: {
    build: 'dist',
    public: 'public',
    source: 'src',
    root: '.',
    modules: []
  },
  get lintOnSave() {
    return isDev(process.env.NODE_ENV as NodeEnv) && allDependencies.includes('eslint')
  },
  dev: {
    host: 'localhost',
    port: 3000,
    verbose: false,
    proxy: {},
    devServer: {},
  },
  build: {
    publicPath: '/',
    assetsDir: 'vun',
    analyze: false,
    runtimeCompiler: false,
    productionSourceMap: true,
    transpileDependencies: [],
    get filenameHashing() {
      return isProd(process.env.NODE_ENV as NodeEnv)
    },
    get parallel() {
      try {
        return require('os').cpus().length > 1
      } catch (error) {
        return false
      }
    },
    css: {
      get extract() {
        return isProd(process.env.NODE_ENV as NodeEnv)
      },
      requireModuleExtension: true,
      sourceMap: false,
      loaderOptions: {} as any,
      styleResources: {
        scss: [],
        sass: [],
        less: [],
        stylus: []
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  babel: {},
  webpack: {},
  typescript: !allDependencies.includes('typescript') ? false : {
    tsLoader: {},
    forkTsChecker: true
  }
}
```

### Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/surmon-china/vuniversal/blob/master/CHANGELOG.md).

### License

[MIT](https://github.com/surmon-china/vuniversal/blob/master/LICENSE)
