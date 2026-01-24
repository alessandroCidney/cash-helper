export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (authStore.loadingAuth && to.name !== 'loading') {
    return navigateTo({ name: 'loading' })
  }
})
