// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
})