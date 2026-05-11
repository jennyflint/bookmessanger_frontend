// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appName: import.meta.env.NUXT_PUBLIC_APP_NAME || 'Default App Name',
      appUrl: import.meta.env.NUXT_PUBLIC_APP_URL,
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE,
      defaultApiVersion: import.meta.env.NUXT_PUBLIC_DEFAULT_API_VERSION

    }
  },
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        noImplicitAny: true,
        strictNullChecks: true
      }
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3007,
    host: '0.0.0.0'
  },
  imports: {
    dirs: [
      'composables/auth',
      'services',
      'services/**',
    ]
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'ua',
    locales: [
      {
        code: 'ua',
        iso: 'uk-UA',
        name: 'Ukrainian',
        file: 'ua.json'
      }
    ]
  },
})