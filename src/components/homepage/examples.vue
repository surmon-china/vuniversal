<template>
  <div class="homepage-examples">
    <transition name="module" mode="out-in">
      <Loading v-if="!inited" class="loading" />
      <div v-else>
        <div
          v-for="(example, index) in examples"
          :key="example.name"
          class="example-item"
        >
          <homepage-example-card
            :path="example.path"
            :title="example.title || example.name"
            :content-class="contentClass"
          >
            <component
              :is="example.name"
              class="example-component"
              :class="exampleClass"
            />
          </homepage-example-card>
          <homepage-basic-card
            v-if="!disabledAutoAd && !!adProviders[index]"
            class="example-mammon"
          >
            <mammon :provider="adProviders[index]" />
          </homepage-basic-card>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, onBeforeMount } from 'vue'
  import Mammon, { MammonProvider, cnMammonProviders, gaMammonProviders } from '@/components/mammon/index.vue'
  import HomepageExampleCard from './card-example.vue'
  import HomepageBasicCard from './card-basic.vue'
  import Loading from './loading.vue'
  import { useStore } from '@/store'

  export interface IExample {
    name: string
    title: string
    path: string
  }
  export default defineComponent({
    name: 'homepage-examples',
    components: {
      Mammon,
      Loading,
      HomepageBasicCard,
      HomepageExampleCard
    },
    props: {
      examples: {
        type: Array as () => Array<IExample>,
        required: true
      },
      disabledAutoAd: {
        type: Boolean,
        default: false
      },
      exampleClass: {
        type: String,
        required: false,
        default: ''
      },
      contentClass: {
        type: String,
        required: false
      }
    },
    setup(props) {
      const store = useStore()
      const rootState = store.state

      const BOUNDARY = 6
      const adProviders = reactive<Array<MammonProvider | null>>(props.examples.map(() => null))
      const inited = computed(() => rootState.inited)

      onBeforeMount(() => {
        const count = props.examples.length
        const isMobileDevice = computed(() => rootState.isMobileDevice)
        const isChinaGuest = computed(() => rootState.isChinaGuest)
        // 如果为非中文用户 || 移动用户 -> 一定展示 GA
        const isMustBeGA = computed(() => !isChinaGuest.value || isMobileDevice.value)

        // 如果总数小于临界值，则仅在中间显示一个，中文用户展示概率为 50%/50%
        if (count <= BOUNDARY) {
          const targetIndex = Math.ceil(count / 2)
          // 非中文用户 || 移动用户 -> GA -> GA(60%)
          adProviders[targetIndex - 1] = isMustBeGA.value
            ? gaMammonProviders[0]
            : ((Math.ceil(Math.random() * 10) > 6)
                ? cnMammonProviders[0]
                : gaMammonProviders[0]
              )
        } else {
          // 否则，插入广告 = 总数量 / allProviders.length + 1
          const allProviders = isMustBeGA.value
            ? gaMammonProviders
            : [...cnMammonProviders, ...gaMammonProviders]
          const targetCount = count / (allProviders.length + 1)
          allProviders.forEach((provider, index) => {
            adProviders[Math.ceil(targetCount * (index + 1)) - 1] = provider
          })
        }
        console.log('AutoMammonProviders', adProviders.slice())
      })

      return { inited, adProviders }
    }
  })
</script>

<style lang="scss" scoped>
  .homepage-examples {
    .loading {
      min-height: 24rem;
      background-color: $module-bg;
    }

    .example-item {
      .example-mammon {
        min-height: 9rem;
        overflow: hidden;
      }
    }
  }
</style>
