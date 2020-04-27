<template>
  <div>User: {{ id }}</div>
</template>

<script>
  import { defineComponent, inject, onMounted } from 'vue'
  import { useHelmet } from '../../fork_modules/vuniversal/helper/helmet'

  export default defineComponent({
    name: 'User',
    props: {
      id: String,
    },
    beforeRouteUpdate(to, from, next) {
      // TODO: these do not work yet
      console.log('this', this)
      next(vm => {
        console.log('in next', vm)
      })
    },
    created() {
      // console.log('=-------created User', this)
    },
    setup() {
      const helemt = useHelmet({
        title: '用户页面啊'
      })

      onMounted(() => {
        // console.log('user onMounted', helemt)
      })
    }
  })
</script>
