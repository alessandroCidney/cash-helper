<template>
  <v-img
    :src="imagePath"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  basePath: { type: String, required: true },
  filename: { type: String, required: true },
})

const themesStore = useThemesStore()

const themePrefix = computed(() => _.kebabCase(themesStore.currentTheme))

const imagePath = computed(() => `${props.basePath}/${themePrefix.value}-${props.filename}`)
</script>
