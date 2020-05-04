
import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './app.vue'
import Adsense from '@/plugins/vue-google-adsense'
// import Swiper from '@/plugins/vue-awesome-swiper'
import Codemirror from '@/plugins/vue-codemirror'
import DragZone from '@/plugins/vue-drag-zone'
import Quill from '@/plugins/vue-quill-editor'

import 'normalize.css/normalize.css'
import '@/assets/styles/app.scss'

const app = createApp(App)

app.use(store)
app.use(router)
// plugins
// @ts-ignore
// app.use(Swiper)
app.use(Codemirror)
app.use(DragZone)
app.use(Quill)
app.use(Adsense)

app.mount('#app')
