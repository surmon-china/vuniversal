<template>
  <homepage :repositorie-id="repositorieId" :class="repositorieId">
    <homepage-examples :examples="examples" slot="content" />
  </homepage>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { getComponentExampleMeta, getHomePageHeadMeta } from '@/transformers/page-meta'
  import { GITHUB_REPOSITORIEL_IDS } from '@/constants'
  import HomepageExamples, { IExample } from '@/components/homepage/examples.vue'
  import Homepage from '@/components/homepage/index.vue'

  const repositorieId = GITHUB_REPOSITORIEL_IDS.VueDragZone
  const examples: IExample[] = []

  getComponentExampleMeta(require('@/projects/vue-drag-zone/examples'))
    .forEach(({ component, fileName, ...others }) => {
      examples.push({
        ...others,
        path: fileName && `projects/${repositorieId}/examples/${fileName}`
      })
      Object.assign(HomepageExamples.components, {
        [component.name]: component
      })
    })

  export default defineComponent({
    name: `page-${repositorieId}`,
    components: {
      Homepage,
      HomepageExamples
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
