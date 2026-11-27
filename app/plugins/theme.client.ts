export default defineNuxtPlugin(() => {
  const { preference, systemDark, isDark } = useTheme()

  preference.value = readStoredTheme()

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = media.matches
  media.addEventListener('change', (event) => {
    systemDark.value = event.matches
  })

  // Another tab changed the theme
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_STORAGE_KEY) preference.value = readStoredTheme()
  })

  watch(
    isDark,
    (dark) => {
      const root = document.documentElement
      root.classList.toggle('dark', dark)
      root.style.colorScheme = dark ? 'dark' : 'light'
    },
    { immediate: true },
  )
})
