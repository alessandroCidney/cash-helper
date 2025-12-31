<template>
  <NuxtLayout>
    <NuxtPage />

    <layouts-app-message />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const routes = getRoutes()
const route = useRoute()

// Head settings
const baseTitle = ref('CashHelper')

const currentRouteName = computed(() => routes.find(item => item.name === route.name)?.title)

const titlePrefix = computed(() => currentRouteName.value ? `${currentRouteName.value} - ` : '')

const titleStr = computed(() => `${titlePrefix.value}${baseTitle.value}`)

useHead({
  title: titleStr,
})

// Theme settings
const vuetifyTheme = useTheme()
const localStorageHandler = useLocalStorage()

vuetifyTheme.change(localStorageHandler.selectedThemeId.value)
</script>
