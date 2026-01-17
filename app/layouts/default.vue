<template>
  <v-app>
    <template v-if="vuetifyDisplay.md.value">
      <layouts-default-app-bar />
      <layouts-default-sidebar />
    </template>

    <template v-else>
      <layouts-default-sidebar />
      <layouts-default-app-bar />
    </template>

    <v-main class="removeTransitions">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const vuetifyDisplay = useDisplay()
</script>

<style lang="scss">
.removeTransitions {
  transition: 0s !important;
}
</style>
