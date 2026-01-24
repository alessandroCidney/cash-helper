<template>
  <NuxtLayout>
    <NuxtPage />

    <layouts-app-message />
  </NuxtLayout>
</template>

<script setup lang="ts">
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

const authStore = useAuthStore()

const themesStore = useThemesStore()

watch(() => authStore.loadingAuth, async (isLoading) => {
  if (!isLoading) {
    themesStore.loadInitialTheme()
  }
})
</script>
