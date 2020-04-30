<template>
  <div class="homepage-example-card">
    <homepage-basic-card
      :title="title"
      :title-link="fileUrl"
      :content-class="contentClass"
    >
      <template #actions>
        <div class="actions">
          <slot name="actions" />
          <button
            v-if="path"
            class="code-button"
            @click="handleViewCode"
          >
            <i class="iconfont icon-code" />
          </button>
        </div>
      </template>
      <slot />
    </homepage-basic-card>
  </div>
</template>

<script lang="ts">
  import CONFIG from '@/constants'
  import { defineComponent } from 'vue'
  import { getGitFileSourceUrl } from '@/transformers/url'
  import { useModalStore } from './modal-store'
  import HomepageBasicCard from './card-basic.vue'

  export default defineComponent({
    name: 'homepage-example-card',
    components: {
      HomepageBasicCard
    },
    props: {
      title: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: false
      },
      contentClass: {
        type: String,
        required: false
      }
    },
    setup(props) {
      const modalStore = useModalStore()
      return {
        fileUrl: props.path && getGitFileSourceUrl(
          CONFIG.GITHUB_UID,
          CONFIG.PROJECT_NAME,
          props.path
        ) || '',
        handleViewCode() {
          if (props.title && props.path) {
            modalStore.open(props.title, props.path)
          }
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  .homepage-example-card {
    .actions {
      display: flex;
      height: 100%;
      align-items: center;

      .code-button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        &:hover {
          color: $link-color;
        }

        .iconfont {
          font-size: $font-size-huge;
        }
      }
    }
  }
</style>
