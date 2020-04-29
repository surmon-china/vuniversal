/**
 * @file vue-google-adsense
 * @module plugins/vue-google-adsense
 * @author Surmon <https://github.com/surmon-china>
 */

import { App, Plugin } from 'vue'
import Ads from 'vue-google-adsense'
import { GOOGLE_ADSENSE_CLIENT } from '@/constants'

import Adsense1 from '@/components/mammon/adsense-responsive-1.vue'
import Adsense2 from '@/components/mammon/adsense-responsive-2.vue'
import Adsense3 from '@/components/mammon/adsense-responsive-3.vue'

export default {
  install(app: App) {
    [Adsense1, Adsense2, Adsense3].forEach(ga => {
      app.component(ga.name as string, ga)
    })
    
    app.use(require('vue-script2'))
    app.use(Ads.Adsense)
    app.use(Ads.InArticleAdsense)
    app.use(Ads.InFeedAdsense)
    app.use(Ads.AutoAdsense, { adClient: GOOGLE_ADSENSE_CLIENT })
  }
} as Plugin
