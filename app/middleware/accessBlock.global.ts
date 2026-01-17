export default defineNuxtRouteMiddleware(async (to) => {
  if (to.name === 'loading') {
    return
  }

  const runtimeConfig = useRuntimeConfig()

  const blockAppAccess = runtimeConfig.public.BLOCK_APP_ACCESS === 'true'

  if (blockAppAccess && to.name === 'block') {
    return
  }

  if (blockAppAccess && to.name !== 'block') {
    return navigateTo({
      name: 'block',
    })
  }

  if (!blockAppAccess && to.name == 'block') {
    return navigateTo({
      name: 'home',
    })
  }
})
