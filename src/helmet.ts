import { HelmetState } from '../fork_modules/vuniversal/helper/helmet'

export const helmetConfig: HelmetState = {
  title: 'test Test',
  htmlAttributes: {
    xmlns: 'http://www.w3.org/1999/xhtml',
    lang: 'zh'
  },
  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'cleartype', content: 'on' },
    { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
    { name: 'author', content: 'surmon' },
    { name: 'MobileOptimized', content: '320' },
    { name: 'HandheldFriendly', content: 'True' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: 'test' },
    { name: 'apple-touch-icon', content: '/static/icon.png' },
    { name: 'msapplication-TileImage', content: '/static/icon.png' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
  ],
  link: [
    { rel: 'dns-prefetch', href: `//surmon.me` },
    { rel: 'dns-prefetch', href: '//api.surmon.me' },
    { rel: 'dns-prefetch', href: '//cdn.surmon.me' },
    { rel: 'dns-prefetch', href: '//static.surmon.me' },
    { rel: 'dns-prefetch', href: '//at.alicdn.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//googleads.g.doubleclick.net' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//tpc.googlesyndication.com' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'author', type: 'text/plain', href: '/humans.txt' }
  ],
  noscript: 'This website requires JavaScript.'
}