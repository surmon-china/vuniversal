/**
 * @file vue-quill-editor
 * @module plugins/vue-quill-editor
 * @author Surmon <https://github.com/surmon-china>
 */

import { App, Plugin } from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'

export default {
  install(app: App) {
    app.use(VueQuillEditor, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ]
      },
      placeholder: 'Global placeholder...'
    })
  }
} as Plugin
