<template>
  <div> 我是测试页面</div>
</template>

<script>
  import { defineComponent, inject, onMounted, onUnmounted } from 'vue'
  import { useHelmet } from '../../fork_modules/vuniversal/helper/helmet'

  export default defineComponent({
    name: 'Test',
    props: {
      id: String,
    },
    setup() {
      const helemt = useHelmet({
        title: '测试页面'
      })

      onMounted(() => {
        // console.log('Test onMounted', helemt)
      })
      onUnmounted(() => {
        // console.log('Test onUnmounted', helemt)
      })
    }
  })
</script>
