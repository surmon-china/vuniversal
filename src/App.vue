<template>
  <div class="main">
    <!-- <transition
      name="fade"
      mode="out-in"
      @before-enter="flushWaiter"
      @before-leave="setupWaiter"
    > -->
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        Loading...
      </template>
    </Suspense>
    <!-- </transition> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount } from 'vue'
  import { StoreNames, useStore } from './store'

  export default defineComponent({
    name: 'app',
    setup() {
      const store = useStore()
      onBeforeMount(() => {
        store.dispatch(StoreNames.Init)
      })
    }
  })
</script>

<style lang="scss" scoped>
  .main {
    background-color: bisque;
  }
</style>
