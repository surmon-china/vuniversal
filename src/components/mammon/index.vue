<template>
  <aliyun-swiper-ad v-if="isEnabledAd(MammonProvider.Aliyun)" key="aliyun" />
  <adsense-responsive-ad-1 v-else-if="isEnabledAd(MammonProvider.GoogleAdSense1)" key="gad1" />
  <adsense-responsive-ad-2 v-else-if="isEnabledAd(MammonProvider.GoogleAdSense2)" key="gad2" />
  <adsense-responsive-ad-3 v-else-if="isEnabledAd(MammonProvider.GoogleAdSense3)" key="gad2" />
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import AliyunSwiperAd from '@/components/mammon/aliyun-swiper.vue'

  export enum MammonProvider {
    Aliyun = 'Aliyun',
    GoogleAdSense1 = 'GoogleAdSense1',
    GoogleAdSense2 = 'GoogleAdSense2',
    GoogleAdSense3 = 'GoogleAdSense3'
  }

  export const cnMammonProviders = [
    MammonProvider.Aliyun
  ]
  export const gaMammonProviders = [
    MammonProvider.GoogleAdSense1,
    MammonProvider.GoogleAdSense2,
    MammonProvider.GoogleAdSense3
  ]

  export default defineComponent({
    name: 'mammon',
    components: {
      AliyunSwiperAd
    },
    props: {
      provider: {
        type: String,
        default: MammonProvider.GoogleAdSense1
      },
    },
    setup(props) {
      return {
        MammonProvider,
        isEnabledAd(provider: MammonProvider) {
          return props.provider === provider
        }
      }
    }
  })
</script>
