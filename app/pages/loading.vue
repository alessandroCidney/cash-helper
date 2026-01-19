<template>
  <div class="d-flex align-center justify-center fill-height">
    <motion.div
      :initial="{
        scale: 0,
      }"
      :animate="{
        scale: 1,
      }"
    >
      <svg
        width="126"
        height="126"
        viewBox="0 0 126 126"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="63"
          cy="63"
          r="60.5"
          fill="rgb(var(--v-theme-primary))"
        />

        <circle
          cx="63"
          cy="63"
          r="48"
          fill="rgb(var(--v-theme-secondary))"
        />

        <motion.circle
          :animate="{
            transform,
          }"
          cx="62.5"
          cy="62.5"
          r="30.5"
          fill="white"
        />
      </svg>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  layout: 'empty',
})

const interval = 4000

const motionTime = useTime()

const transform = ref(`translateX(0px)`)

const intervalKey = ref<ReturnType<typeof setInterval>>()

onMounted(() => {
  intervalKey.value = setInterval(() => {
    const currentTime = motionTime.get() % interval

    if (currentTime > 3500) {
      transform.value = `translateX(0px)`
      return
    }

    if (currentTime > 2500) {
      transform.value = `translateX(-12px)`
      return
    }

    if (currentTime > 1500) {
      transform.value = `translateX(12px)`
      return
    }

    transform.value = 'translateX(0)'
  }, 1)
})

onUnmounted(() => {
  if (intervalKey.value) {
    clearInterval(intervalKey.value)
  }
})
</script>

<style lang="scss" scoped>
.testAnimation {
  background-color: red;
  width: 200px;
  height: 200px;
}

.testDiv {
  width: 30px;
  height: 30px;

  background-color: red;
}
</style>
