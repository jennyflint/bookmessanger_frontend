export type ThemePreference = 'light' | 'dark' | 'system'

// Keep in sync with the inline head script in nuxt.config.ts.
export const THEME_STORAGE_KEY = 'theme'

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

export const readStoredTheme = (): ThemePreference => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export interface UseTheme {
  preference: Ref<ThemePreference>
  systemDark: Ref<boolean>
  isDark: ComputedRef<boolean>
  setTheme: (value: ThemePreference) => void
}

export const useTheme = (): UseTheme => {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')
  const systemDark = useState<boolean>('theme-system-dark', () => false)

  const isDark = computed<boolean>(
    () => preference.value === 'dark' || (preference.value === 'system' && systemDark.value),
  )

  const setTheme = (value: ThemePreference): void => {
    preference.value = value
    try {
      if (value === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch {
      // storage unavailable (private mode etc.) — keep the in-memory choice
    }
  }

  return { preference, systemDark, isDark, setTheme }
}
