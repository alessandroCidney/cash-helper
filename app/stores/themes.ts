import { useTheme } from 'vuetify'

export const useThemesStore = defineStore('themes', () => {
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()

  const THEME_SETTINGS_LOCAL_STORAGE_KEY = `${runtimeConfig.public.PROJECT_ID}-theme-settings`

  const themesData = computed(() => [
    {
      id: 'lightTheme',
      colors: [lightTheme.colors.secondary, lightTheme.colors.primary, lightTheme.colors.container],
      title: 'Tema Claro',
      description: 'Desbloqueável com a conquista "Novato"',

      allowed: true,
    },
    {
      id: 'darkTheme',
      colors: [darkTheme.colors.secondary, darkTheme.colors.primary, darkTheme.colors.container],
      title: 'Tema Escuro',
      description: 'Desbloqueável com a conquista "Novato"',

      allowed: true,
    },
    {
      id: 'lovingTheme',
      colors: [lovingTheme.colors.secondary, lovingTheme.colors.primary, lovingTheme.colors.container],
      title: 'Tema Amoroso',
      description: 'Desbloqueável com a conquista "Amoroso"',

      allowed: !!authStore.privateProfileData?.achievements.complete.find(item => item.id === 'loving'),
    },
  ])

  function themeIsAllowed(themeId: string) {
    return !!themesData.value.find(item => item.id === themeId)?.allowed
  }

  function getSavedTheme() {
    const savedThemeId = localStorage.getItem(THEME_SETTINGS_LOCAL_STORAGE_KEY)

    if (typeof savedThemeId === 'string' && themeIsAllowed(savedThemeId)) {
      return savedThemeId
    }

    return 'lightTheme'
  }

  const currentTheme = ref('lightTheme')

  function setTheme(themeId: string) {
    if (themeIsAllowed(themeId)) {
      currentTheme.value = themeId

      localStorage.setItem(THEME_SETTINGS_LOCAL_STORAGE_KEY, themeId)

      vuetifyTheme.change(themeId)
    } else {
      throw new ApplicationError({
        status: 403,
        code: APP_ERROR_CODES.DEFAULT_ERRORS.FORBIDDEN,
        message: 'O tema selecionado não está disponível',
      })
    }
  }

  const vuetifyTheme = useTheme()

  function loadInitialTheme() {
    currentTheme.value = getSavedTheme() || 'lightTheme'

    vuetifyTheme.change(currentTheme.value)
  }

  return {
    setTheme,
    themesData,
    currentTheme,
    loadInitialTheme,
  }
})
