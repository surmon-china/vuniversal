<template>
  <Adsense
    :root-class="`mammon g-a ${rootClass}`"
    :data-ad-client="GOOGLE_ADSENSE_CLIENT"
    :data-full-width-responsive="true"
    :is-non-personalized-ads="false"
    data-ad-slot="7455679385"
  />
</template>

<script lang="ts">
  import Vue from 'vue'
  import { defineComponent } from 'vue'
  import { GOOGLE_ADSENSE_CLIENT } from '@/constants'
  export default defineComponent({
    name: 'AdsenseResponsiveAd2',
    props: {
      rootClass: String
    },
    setup() {
      return {
        GOOGLE_ADSENSE_CLIENT
      }
    }
  })
</script>
