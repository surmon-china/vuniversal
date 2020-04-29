
import { defineComponent, h, ref, watch, computed, onBeforeMount } from 'vue'
import { numberSplit } from '@/transformers/unit'

export default defineComponent({
  name: 'animated-number',
  props: {
    number: {
      type: Number,
      required: true
    },
    placeholder: {
      type: String,
      default: '...'
    },
    speed: {
      type: Number,
      default: 6
    }
  },
  setup(props) {
    const display = ref<number>(0)
    const interval = ref<number>()

    const displayText = computed(() => display.value
      ? numberSplit(display.value)
      : props.placeholder
    )

    const animation = () => {
      interval.value = window.setInterval(() => {
        if (display.value !== props.number) {
          const difference = (props.number - display.value) / props.speed
          const step = difference >= 0
            ? Math.ceil(difference)
            : Math.floor(difference)
          display.value = display.value + step
        } else {
          window.clearInterval(interval.value)
        }
      }, 20)
    }

    onBeforeMount(() => {
      display.value = props.number
    })

    watch(
      () => props.number,
      () => {
        if (props.number != null) {
          setTimeout(animation, 666)
        }
      },
      {
        immediate: false
      }
    )

    return () => h('span', {}, [displayText.value])
  }
})
