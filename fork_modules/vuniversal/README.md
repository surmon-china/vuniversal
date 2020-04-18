
# vuniversal

### use

```ts
import { render, getAssets } from 'vuniversal'
```

### command

- `dev` 开发，需要新建一个 .vun 文件夹，此文件夹只用于开发，需 git 忽略
- `build` 构建，根据用户指定的文件夹，如 `dist` 进行构建，构建出的文件结构大致为：
  - `build/client/*`
  - `build/client/vun`
  - `build/client/fonts | images | index.html | xxx`
  - `build/server/*.js`
  - `build/assets.js`
  - `build/chunks.js`
- `generate` 转换，转换静态资源到 `dist` 中，同时将路由生成为文件夹 index.html 放在 client 文件夹中
  - === build:spa + write:file
