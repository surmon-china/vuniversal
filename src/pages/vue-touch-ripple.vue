<template>
  <homepage :repositorie-id="repositorieId" :class="repositorieId">
    <template #content>
      <!-- <touch-ripple class="love" color="#fff">
        <div class="heart">
          <span class="text">Surmon</span>
        </div>
      </touch-ripple> -->
      <!-- <touch-ripper-example-button-element /> -->
      <!-- <homepage-examples :examples="examples" /> -->
    </template>
    <!-- <homepage-examples #content :examples="examples" /> -->
  </homepage>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { GITHUB_REPOSITORIEL_IDS } from '@/constants'
  import { getComponentExampleMeta, getHomePageHeadMeta } from '@/transformers/page-meta'
  import HomepageExamples, { IExample } from '@/components/homepage/examples.vue'
  import Homepage from '@/components/homepage/index.vue'
  import { touchRipple } from 'vue-touch-ripple'

  const repositorieId = GITHUB_REPOSITORIEL_IDS.VueTouchRipple
  const examples: IExample[] = []
  const components = {}

  getComponentExampleMeta(require('@/projects/vue-touch-ripple/examples'))
    .forEach(({ component, fileName, ...others }) => {
      examples.push({
        ...others,
        path: `src/projects/${repositorieId}/examples/${fileName}`
      })
      Object.assign(components, {
        [component.name]: component
      })
      Object.assign(HomepageExamples.components, {
        [component.name]: component
      })
    })

  console.log('--------touch ripple', HomepageExamples, components)

  export default defineComponent({
    name: `page-${repositorieId}`,
    components: {
      Homepage,
      // touchRipple,
      // HomepageExamples,
      ...components
    },
    head: getHomePageHeadMeta(repositorieId),
    setup() {
      return {
        repositorieId,
        examples
      }
    }
  })
</script>
