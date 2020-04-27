
import { createVueApp } from './main'

const { app, helmet } = createVueApp()
console.log('-------客户端安装', app, helmet)
app.mount('#app')
