import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'motion-v/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error - Vuetify documentation says this comment is required for the configuration to work correctly
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  ssr: false,

  devtools: { enabled: false },

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          charset: 'utf-8',
        },

        // Generated with realfavicongenerator.net
        {
          name: 'apple-mobile-web-app-title',
          content: 'MoneySpy',
        },
      ],

      title: 'MoneySpy',

      link: [
        // Generated with realfavicongenerator.net
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],

      style: [],
      script: [],
      noscript: [],
    },
  },

  css: [
    '@/assets/scss/global.scss',
  ],

  runtimeConfig: {
    public: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,

      BLOCK_APP_ACCESS: process.env.BLOCK_APP_ACCESS,
      SUPPORT_FORM_URL: process.env.SUPPORT_FORM_URL,
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  compatibilityDate: '2025-07-15',

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        commaDangle: 'always-multiline',
      },
    },
  },
})
