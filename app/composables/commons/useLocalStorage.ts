import { useTheme } from 'vuetify'

export function useLocalStorage() {
  const themesDataArr = getThemesDataArr()

  const vuetifyTheme = useTheme()
  const runtimeConfig = useRuntimeConfig()

  const THEME_SETTINGS_LOCAL_STORAGE_KEY = `${runtimeConfig.public.PROJECT_ID}-theme-settings`
  const defaultThemeId = themesDataArr[0]?.id as string

  const selectedThemeId = ref(defaultThemeId)

  function themeIsAllowed(themeId: string) {
    return !!themesDataArr.find(item => item.id === themeId)?.allowed
  }

  /* TODO: Review dark theme colors / Fix loving theme reload error */
  // function getSystemTheme() {
  //   return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  //     ? 'darkTheme'
  //     : 'lightTheme'
  // }

  function loadSavedTheme() {
    const savedThemeId = localStorage.getItem(THEME_SETTINGS_LOCAL_STORAGE_KEY)

    if (typeof savedThemeId === 'string' && themeIsAllowed(savedThemeId)) {
      selectedThemeId.value = savedThemeId
    }

    if (savedThemeId === null) {
      selectedThemeId.value = 'lightTheme' // getSystemTheme()
    }
  }

  loadSavedTheme()

  return {
    selectedThemeId,

    loadSavedTheme,

    setThemeId(themeId: string) {
      if (themeIsAllowed(themeId)) {
        selectedThemeId.value = themeId

        localStorage.setItem(THEME_SETTINGS_LOCAL_STORAGE_KEY, themeId)

        vuetifyTheme.change(themeId)
      } else {
        throw new ApplicationError({
          status: 403,
          code: APP_ERROR_CODES.DEFAULT_ERRORS.FORBIDDEN,
          message: 'O tema selecionado não está disponível',
        })
      }
    },
  }
}
