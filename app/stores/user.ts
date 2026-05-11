export const useUserStore = defineStore('user', () => {
  const config = useRuntimeConfig()
  const appHost = config.public.appHost
  const cookieOptions = {
    domain: appHost,
    default: (): null => null
  }

  const accessToken = useCookie<string | null>('access_token', cookieOptions)
  const refreshToken = useCookie<string | null>('refresh_token', cookieOptions)
  const userEmail = useCookie<string | null>('user_email', cookieOptions)
  const isAuthenticated = computed(() => !!accessToken.value || !!refreshToken.value)

  const logout = (): void => {
    accessToken.value = null
    refreshToken.value = null
    userEmail.value = null
  }

  const refreshSession = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      logout()
    }
    return true
  }

  return {
    accessToken,
    refreshToken,
    userEmail,
    isAuthenticated,
    logout,
    refreshSession
  }
})
