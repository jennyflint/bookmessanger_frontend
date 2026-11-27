// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiBase: import.meta.env.NUXT_API_BASE,
    public: {
      appName: import.meta.env.NUXT_PUBLIC_APP_NAME || 'Default App Name',
      appUrl: import.meta.env.NUXT_PUBLIC_APP_URL,
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE,
      appHost: import.meta.env.NUXT_PUBLIC_APP_HOST,
      defaultApiVersion: import.meta.env.NUXT_PUBLIC_DEFAULT_API_VERSION,
      uploadBookFormats: ["txt", "epub", "fb2"],

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
      'composables',
      'composables/**',
      'services',
      'services/**',
    ]
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  app: {
    head: {
      link: [
        // Nunito: rounded font with both Latin and Cyrillic glyphs
        // (Fredoka One had Latin only, so Ukrainian fell back to another font)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@600..900&display=swap' },
      ],
      script: [
        {
          // Applies the saved/system theme before first paint to avoid a flash.
          // Keep the storage key in sync with app/composables/useTheme.ts.
          tagPosition: 'head',
          innerHTML: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
        },
      ],
    },
  },
  tailwindcss: {
    // Holds the theme CSS variables; must replace the module's default entry
    cssPath: '~/assets/css/tailwind.css',
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'ua',
        iso: 'uk-UA',
        name: 'Ukrainian',
        file: 'ua.json'
      }
    ]
  },
})