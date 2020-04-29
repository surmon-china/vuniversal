

// 1. 先为应用打包
// 2. 大包过程记录好每一个页面的 id
// 3. 进行 generate，

// createSSRApp(targetPage) 

// 递归循环处理每一个匹配的路由，将每个路由的组件 createSSRApp().toString(), 然后混合 html template 输出
// export const generateApp = () => {
//   console.log('转换一个应用至静态')
// }

// /*!
//  * @nuxt/generator v2.12.1 (c) 2016-2020

//  * - All the amazing contributors
//  * Released under the MIT License.
//  * Website: https://nuxtjs.org
// */
// 'use strict';

// Object.defineProperty(exports, '__esModule', { value: true });

// function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

// const path = _interopDefault(require('path'));
// const Chalk = _interopDefault(require('chalk'));
// const consola = _interopDefault(require('consola'));
// const fsExtra = _interopDefault(require('fs-extra'));
// const htmlMinifier = _interopDefault(require('html-minifier'));
// const utils = require('@nuxt/utils');

// class Generator {
//   constructor (nuxt, builder) {
//     this.nuxt = nuxt;
//     this.options = nuxt.options;
//     this.builder = builder;

//     // Set variables
//     this.staticRoutes = path.resolve(this.options.srcDir, this.options.dir.public);
//     this.srcBuiltPath = path.resolve(this.options.buildDir, 'dist', 'client');
//     this.distPath = this.options.generate.dir;
//     this.distNuxtPath = path.join(
//       this.distPath,
//       utils.isUrl(this.options.build.publicPath) ? '' : this.options.build.publicPath
//     );
//   }

//   async generate ({ build = true, init = true } = {}) {
//     consola.debug('Initializing generator...');

//     await this.initiate({ build, init });

//     consola.debug('Preparing routes for generate...');

//     const routes = await this.initRoutes();

//     consola.info('Generating pages');

//     const errors = await this.generateRoutes(routes);

//     await this.afterGenerate();

//     // Done hook
//     await this.nuxt.callHook('generate:done', this, errors);

//     return { errors }
//   }

//   async initiate ({ build = true, init = true } = {}) {
//     // Wait for nuxt be ready
//     await this.nuxt.ready();

//     // Call before hook
//     await this.nuxt.callHook('generate:before', this, this.options.generate);

//     if (build) {
//       // Add flag to set process.static
//       this.builder.forGenerate();

//       // Start build process
//       await this.builder.build();
//     }

//     // Initialize dist directory
//     if (init) {
//       await this.initDist();
//     }
//   }

//   async initRoutes (...args) {
//     // Resolve config.generate.routes promises before generating the routes
//     let generateRoutes = [];
//     if (this.options.router.mode !== 'hash') {
//       try {
//         generateRoutes = await utils.promisifyRoute(
//           this.options.generate.routes || [],
//           ...args
//         );
//       } catch (e) {
//         consola.error('Could not resolve routes');
//         throw e // eslint-disable-line no-unreachable
//       }
//     }
//     // Generate only index.html for router.mode = 'hash'
//     let routes =
//       this.options.router.mode === 'hash'
//         ? ['/']
//         : utils.flatRoutes(this.options.router.routes);

//     routes = routes.filter(route => this.options.generate.exclude.every(regex => !regex.test(route)));

//     routes = this.decorateWithPayloads(routes, generateRoutes);

//     // extendRoutes hook
//     await this.nuxt.callHook('generate:extendRoutes', routes);

//     return routes
//   }

//   async generateRoutes (routes) {
//     const errors = [];

//     // Start generate process
//     while (routes.length) {
//       let n = 0;
//       await Promise.all(
//         routes
//           .splice(0, this.options.generate.concurrency)
//           .map(async ({ route, payload }) => {
//             await utils.waitFor(n++ * this.options.generate.interval);
//             await this.generateRoute({ route, payload, errors });
//           })
//       );
//     }

//     // Improve string representation for errors
//     // TODO: Use consola for more consistency
//     errors.toString = () => this._formatErrors(errors);

//     return errors
//   }

//   _formatErrors (errors) {
//     return errors
//       .map(({ type, route, error }) => {
//         const isHandled = type === 'handled';
//         const color = isHandled ? 'yellow' : 'red';

//         let line = Chalk[color](` ${route}\n\n`);

//         if (isHandled) {
//           line += Chalk.grey(JSON.stringify(error, undefined, 2) + '\n');
//         } else {
//           line += Chalk.grey(error.stack || error.message || `${error}`);
//         }

//         return line
//       })
//       .join('\n')
//   }

//   async afterGenerate () {
//     const { fallback } = this.options.generate;

//     // Disable SPA fallback if value isn't a non-empty string
//     if (typeof fallback !== 'string' || !fallback) {
//       return
//     }

//     const fallbackPath = path.join(this.distPath, fallback);

//     // Prevent conflicts
//     if (await fsExtra.exists(fallbackPath)) {
//       consola.warn(`SPA fallback was configured, but the configured path (${fallbackPath}) already exists.`);
//       return
//     }

//     // Render and write the SPA template to the fallback path
//     let { html } = await this.nuxt.server.renderRoute('/', { spa: true });

//     try {
//       html = this.minifyHtml(html);
//     } catch (error) {
//       consola.warn('HTML minification failed for SPA fallback');
//     }

//     await fsExtra.writeFile(fallbackPath, html, 'utf8');
//   }

//   async initDist () {
//     // Clean destination folder
//     await fsExtra.remove(this.distPath);

//     await this.nuxt.callHook('generate:distRemoved', this);

//     // Copy static and built files
//     if (await fsExtra.exists(this.staticRoutes)) {
//       await fsExtra.copy(this.staticRoutes, this.distPath);
//     }
//     await fsExtra.copy(this.srcBuiltPath, this.distNuxtPath);

//     // Add .nojekyll file to let GitHub Pages add the _nuxt/ folder
//     // https://help.github.com/articles/files-that-start-with-an-underscore-are-missing/
//     const nojekyllPath = path.resolve(this.distPath, '.nojekyll');
//     fsExtra.writeFile(nojekyllPath, '');

//     await this.nuxt.callHook('generate:distCopied', this);
//   }

//   decorateWithPayloads (routes, generateRoutes) {
//     const routeMap = {};
//     // Fill routeMap for known routes
//     routes.forEach((route) => {
//       routeMap[route] = { route, payload: null };
//     });
//     // Fill routeMap with given generate.routes
//     generateRoutes.forEach((route) => {
//       // route is either a string or like { route : '/my_route/1', payload: {} }
//       const path = utils.isString(route) ? route : route.route;
//       routeMap[path] = {
//         route: path,
//         payload: route.payload || null
//       };
//     });
//     return Object.values(routeMap)
//   }

//   async generateRoute ({ route, payload = {}, errors = [] }) {
//     let html;
//     const pageErrors = [];

//     try {
//       const res = await this.nuxt.server.renderRoute(route, {
//         _generate: true,
//         payload
//       })
//       ;({ html } = res);
//       if (res.error) {
//         pageErrors.push({ type: 'handled', route, error: res.error });
//       }
//     } catch (err) {
//       pageErrors.push({ type: 'unhandled', route, error: err });
//       errors.push(...pageErrors);

//       await this.nuxt.callHook('generate:routeFailed', {
//         route,
//         errors: pageErrors
//       });
//       consola.error(this._formatErrors(pageErrors));

//       return false
//     }

//     try {
//       html = this.minifyHtml(html);
//     } catch (err) {
//       const minifyErr = new Error(
//         `HTML minification failed. Make sure the route generates valid HTML. Failed HTML:\n ${html}`
//       );
//       pageErrors.push({ type: 'unhandled', route, error: minifyErr });
//     }

//     let fileName;

//     if (this.options.generate.subFolders) {
//       fileName = path.join(route, path.sep, 'index.html'); // /about -> /about/index.html
//       fileName = fileName === '/404/index.html' ? '/404.html' : fileName; // /404 -> /404.html
//     } else {
//       const normalizedRoute = route.replace(/\/$/, '');
//       fileName = route.length > 1 ? path.join(path.sep, normalizedRoute + '.html') : path.join(path.sep, 'index.html');
//     }

//     // Call hook to let user update the path & html
//     const page = { route, path: fileName, html };
//     await this.nuxt.callHook('generate:page', page);

//     page.path = path.join(this.distPath, page.path);

//     // Make sure the sub folders are created
//     await fsExtra.mkdirp(path.dirname(page.path));
//     await fsExtra.writeFile(page.path, page.html, 'utf8');

//     await this.nuxt.callHook('generate:routeCreated', {
//       route,
//       path: page.path,
//       errors: pageErrors
//     });

//     if (pageErrors.length) {
//       consola.error('Error generating ' + route);
//       errors.push(...pageErrors);
//     } else {
//       consola.success('Generated ' + route);
//     }

//     return true
//   }

//   minifyHtml (html) {
//     let minificationOptions = this.options.build.html.minify;

//     // Legacy: Override minification options with generate.minify if present
//     // TODO: Remove in Nuxt version 3
//     if (typeof this.options.generate.minify !== 'undefined') {
//       minificationOptions = this.options.generate.minify;
//       consola.warn('generate.minify has been deprecated and will be removed in the next major version.' +
//         ' Use build.html.minify instead!');
//     }

//     if (!minificationOptions) {
//       return html
//     }

//     return htmlMinifier.minify(html, minificationOptions)
//   }
// }

// function getGenerator (nuxt) {
//   return new Generator(nuxt)
// }

// exports.Generator = Generator;
// exports.getGenerator = getGenerator;