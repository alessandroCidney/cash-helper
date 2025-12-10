<template>
  <v-app v-if="authStore.loadingAuth">
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
            fill="#1ADB87"
          />

          <circle
            cx="63"
            cy="63"
            r="51"
            fill="black"
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
  </v-app>

  <slot v-else />
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const authStore = useAuthStore()

const interval = 4500

const motionTime = useTime()

const transform = ref(`translateX(0px)`)

const intervalKey = ref<ReturnType<typeof setInterval>>()

onMounted(() => {
  intervalKey.value = setInterval(() => {
    if (!authStore.loadingAuth) {
      clearInterval(intervalKey.value)
      return
    }

    const currentTime = motionTime.get() % interval

    if (currentTime > 4000) {
      transform.value = `translateX(0px)`
      return
    }

    if (currentTime > 3000) {
      transform.value = `translateX(-15px)`
      return
    }

    if (currentTime > 2000) {
      transform.value = `translateX(0px)`
      return
    }

    if (currentTime > 1000) {
      transform.value = `translateX(15px)`
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
