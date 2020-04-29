<template>
  <a
    :href="url"
    class="badge download"
    target="_blank"
  >
    <img
      class="image"
      alt="npm downloads"
      :src="`https://img.shields.io/npm/${interval}/${name}?style=${size}&label=${label}`"
    >
  </a>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { getNPMUrl } from '@/transformers/url'
  import { BadgeStyle, DownloadInterval } from './constants'

  export default defineComponent({
    name: 'badge-npm-downloads',
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: BadgeStyle.Normal
      },
      interval: {
        type: String,
        default: DownloadInterval.DW
      },
      label: {
        type: String,
        default: 'npm%20downloads'
      },
      color: {
        type: String
      }
    },
    setup(props) {
      return {
        url: getNPMUrl(props.name)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .badge {
    .image {
      display: block;
      height: 20px;
    }
  }
</style>
