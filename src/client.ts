
import { createVueApp } from './main'

const { app, meta } = createVueApp()
console.log('-------客户端安装', app, meta)
app.mount('#app')
