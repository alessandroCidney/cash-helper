import { getAuth } from 'firebase/auth'

import { useAchievements } from '~/composables/plugins/useAchievements'

import { useExpensesStore } from '~/stores/cruds/expenses'

async function loadAdditionalItems() {
  const authStore = useAuthStore()
  const usersCrud = useUsersCrud()
  const notificationsStore = useNotificationsStore()

  // "Cached" cruds
  const expensesStore = useExpensesStore()
  expensesStore.list()

  // First login
  if (authStore.databaseUser?.firstLogin && authStore.emailIsVerified && !authStore.incompleteProfile) {
    const result = await usersCrud.update({
      ...authStore.databaseUser,
      firstLogin: false,
    })

    authStore.setDatabaseUser(result as DatabaseUser)

    notificationsStore.addAchievementNotification('beginner')
  }

  const { loadAndCheckAchievements } = useAchievements()

  await loadAndCheckAchievements()
}

async function authCheck() {
  const authStore = useAuthStore()
  const usersCrud = useUsersCrud()

  const auth = getAuth()
  await auth.authStateReady()

  const authUser = auth.currentUser

  try {
    if (authUser) {
      const databaseUser = await usersCrud.get(authUser.uid)
      const databaseUserPrivateData = await usersCrud.getPrivateProfileData(authUser.uid)

      authStore.setAuthUser(authUser)
      authStore.setDatabaseUser(databaseUser)
      authStore.setPrivateProfileData(databaseUserPrivateData)

      await loadAdditionalItems()
    } else {
      throw new Error('Unauthenticated')
    }
  } catch {
    authStore.setAuthUser(null)
    authStore.setDatabaseUser(null)
    authStore.setPrivateProfileData(null)
  } finally {
    authStore.setLoadingAuth(false)
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()

  const initialTargetRoute = route.name === 'loading'
    ? {
        name: 'index',
      }
    : {
        name: route.name,
        params: route.params,
        query: route.query,
      }

  // Executed after the initial run of middlewares
  nuxtApp.hook('app:created', async () => {
    // Redirect to loading to allow middlewares rerun in the next redirection
    await navigateTo({
      name: 'loading',
    })

    // If you use "await" here, the loading will not be shown
    authCheck()
      .then(() => {
        navigateTo(initialTargetRoute)
      })
  })
})
