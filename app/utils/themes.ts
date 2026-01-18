export const lightTheme = {
  dark: false,

  colors: {
    'primary': '#1ADB87',
    'secondary': '#023B2F',
    'root': '#FFFFFF',
    'container': '#f8f8f8',
    'card': '#FFFFFF',
    'line': '#eeeeee',
    'neutral': '#424A52',
    'neutral-darken-1': '#525C66',
    'text': '#000000',

    'red': '#F44336',
    'deep-purple': '#673AB7',
    'black': '#000000',
  },
}

export const darkTheme = {
  dark: true,

  colors: {
    'primary': '#1ADB87',
    'secondary': '#0F804F',
    'root': '#212121',
    'container': '#333333',
    'card': '#3D3D3D',
    'line': '#525252',
    'neutral': '#f8f8f8',
    'text': '#FFFFFF',

    'red': '#F44336',
    'deep-purple': '#673AB7',
    'black': '#000000',
  },
}

export const lovingTheme = {
  dark: false,

  colors: {
    'primary': '#F44336',
    'secondary': '#9B1208',
    'root': '#FEEDEC',
    'container': '#FDDAD8',
    'card': '#FCC8C5',
    'line': '#FBB5B1',
    'neutral': '#4E0804',
    'text': '#000000',

    'red': '#F44336',
    'deep-purple': '#673AB7',
    'black': '#000000',
  },
}

export function getThemesDataArr() {
  const authStore = useAuthStore()

  return [
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
  ]
}
