<template>
  <homepage
    :class="repositorieId"
    :repositorie-id="repositorieId"
    :footer-ad-provider="adProvider"
  >
    <component
      :is="example.name"
      v-for="example in examples"
      #content
      :key="example.name"
      :path="example.path"
      :title="example.title || example.name"
    />
  </homepage>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { getComponentExampleMeta, getHomePageHeadMeta } from '@/transformers/page-meta'
  import { GITHUB_REPOSITORIEL_IDS } from '@/constants'
  import { MammonProvider } from '@/components/mammon/index.vue'
  import { IExample } from '@/components/homepage/examples.vue'
  import HomepageExampleCard from '@/components/homepage/card-example.vue'
  import Homepage from '@/components/homepage/index.vue'

  const repositorieId = GITHUB_REPOSITORIEL_IDS.Naivebayes
  const examples: IExample[] = []
  const components = {
    Homepage,
    HomepageExampleCard
  }

  getComponentExampleMeta(require('@/projects/naivebayes'))
    .forEach(({ component, fileName, ...others }) => {
      examples.push({
        ...others,
        path: `src/projects/${repositorieId}/${fileName}`
      })
      Object.assign(components, {
        [component.name]: component
      })
    })

  export default defineComponent({
    name: `page-${repositorieId}`,
    components,
    head: getHomePageHeadMeta(repositorieId),
    setup() {
      return {
        repositorieId,
        examples,
        adProvider: MammonProvider.GoogleAdSense1
      }
    }
  })
</script>
