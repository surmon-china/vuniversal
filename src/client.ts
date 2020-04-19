
import { createVueApp } from './main'

const { app } = createVueApp()
console.log('-------客户端安装3', app)
app.mount('#app')
